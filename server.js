const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Variables para los módulos opcionales
let Pool, bcrypt;

// Intentar cargar los módulos de PostgreSQL y bcrypt
try {
  const pg = require('pg');
  Pool = pg.Pool;
  bcrypt = require('bcrypt');
  console.log('Módulos pg y bcrypt cargados correctamente');
} catch (err) {
  console.error('Error al cargar módulos pg y bcrypt:', err.message);
  console.log('Ejecutando en modo sin base de datos');
}

const PORT = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL (solo si los módulos están disponibles)
let pool;
if (Pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ventassccrn',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });
}

// Crear tabla de usuarios si no existe (solo si los módulos están disponibles)
async function initializeDatabase() {
  if (!pool) {
    console.log('Base de datos no disponible, omitiendo inicialización');
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);

    // Verificar si existe el usuario admin, si no existe, crearlo
    const adminExists = await pool.query('SELECT * FROM users WHERE username = $1', ['admin']);

    if (adminExists.rows.length === 0) {
      // Hash de la contraseña "admin123"
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', ['admin', hashedPassword]);
      console.log('Usuario admin creado con contraseña: admin123');
    }
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
  }
}

// Función para verificar si el usuario está autenticado
async function isAuthenticated(req) {
  const queryObject = url.parse(req.url, true).query;
  const cookies = req.headers.cookie ? req.headers.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value;
    return acc;
  }, {}) : {};

  // Si tiene el parámetro auth=true o una cookie de sesión, verificar si existe una sesión válida
  if (queryObject.auth === 'true' || cookies.session === 'valid') {
    // En una aplicación real, aquí verificarías una sesión o token válido
    // Por ahora, simplemente retornaremos true si el parámetro está presente
    return true;
  }

  return false;
}

// Función para validar las credenciales del usuario
async function validateCredentials(username, password) {
  // Si no hay módulos de base de datos, usar autenticación simple
  if (!pool || !bcrypt) {
    console.log('Validación sin base de datos');
    return username === 'admin' && password === 'admin123';
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return false; // Usuario no encontrado
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid;
  } catch (err) {
    console.error('Error al validar credenciales:', err);
    return false;
  }
}

// Crear el servidor
const server = http.createServer(async (req, res) => {
  // Manejar solicitud de login
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const params = new URLSearchParams(body);
        const username = params.get('username');
        const password = params.get('password');

        const isValid = await validateCredentials(username, password);

        if (isValid) {
          res.writeHead(302, { 
            'Location': '/index.html',
            'Set-Cookie': 'session=valid; Max-Age=3600; HttpOnly; Path=/'
          });
        } else {
          res.writeHead(302, { 'Location': '/login.html?error=1' });
        }

        res.end();
      } catch (err) {
        console.error('Error en el login:', err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Error interno del servidor</h1>');
      }
    });

    return;
  }

  // Redirigir a login si no está autenticado y no está ya en la página de login
  if ((req.url === '/' || req.url === '/index.html') && !req.url.includes('auth=true')) {
    if (!(await isAuthenticated(req))) {
      res.writeHead(302, { 'Location': '/login.html' });
      return res.end();
    }
  }

  // Construir la ruta del archivo solicitado
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Manejar rutas con mayúsculas/minúsculas en sistemas sensibles a mayúsculas
  if (!fs.existsSync(filePath)) {
    // Intentar convertir a minúsculas la extensión
    const parsedPath = path.parse(filePath);
    if (parsedPath.ext) {
      const lowerExtPath = path.join(parsedPath.dir, parsedPath.name + parsedPath.ext.toLowerCase());
      if (fs.existsSync(lowerExtPath)) {
        filePath = lowerExtPath;
      }
    }
  }

  // Obtener la extensión del archivo
  const extname = path.extname(filePath).toLowerCase();

  // Establecer el tipo de contenido por defecto
  let contentType = 'text/html';

  // Establecer el tipo de contenido según la extensión del archivo
  switch (extname) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
  }

  // Leer el archivo
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Archivo no encontrado
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf8');
        });
      } else {
        // Error del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${err.code}`);
      }
    } else {
      // Respuesta exitosa
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

// Inicializar la base de datos y luego iniciar el servidor
initializeDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al iniciar el servidor:', err);
  // Iniciar el servidor incluso si hay errores en la base de datos
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} (modo sin base de datos)`);
  });
});

