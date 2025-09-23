const   $submit = document.getElementById("submit"),
        $password = document.getElementById("password"),
        $username = document.getElementById("username"),
        $visible = document.getElementById("visible")

    
        document.addEventListener("change",(e)=>{
            if(e.target === $visible){
                if($visible.checked === false)$password.type = "password";
                else $password.type = "text";
            }
        });


        document.addEventListener("click",(e)=>{
            if(e.target === $submit){
                if($password.value !== "" && $username.value !== ""){
                        e.preventDefault();

                        // Crear un objeto URLSearchParams con las credenciales
                        const params = new URLSearchParams();
                        params.append('username', $username.value);
                        params.append('password', $password.value);

                        // Enviar las credenciales al servidor
                        fetch('/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: params
                        })
                        .then(response => {
                            if (response.ok) {
                                // Si la respuesta es OK, redirigir a la página principal
                                window.location.href = '/index.html';
                            } else {
                                // Mostrar mensaje de error
                                alert('Usuario o contraseña incorrectos');
                            }
                        })
                        .catch(error => {
                            console.error('Error en el login:', error);
                            alert('Error al intentar iniciar sesión');
                        });
                }
            }
        })