
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// Función para verificar si el usuario está autenticado
function isAuthenticated(req) {
  // En una aplicación real, aquí verificarías cookies, tokens de sesión, etc.
  // Por ahora, simplemente verificaremos si la URL contiene un parámetro de autenticación
  const queryObject = url.parse(req.url, true).query;
  return queryObject.auth === 'true';
}

const server = http.createServer((req, res) => {
  // Redirigir a login si no está autenticado y no está ya en la página de login
  if (req.url === '/' || req.url === '/index.html') {
    if (!isAuthenticated(req)) {
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

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
