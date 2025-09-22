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

                        // Crear un objeto FormData con las credenciales
                        const formData = new FormData();
                        formData.append('username', $username.value);
                        formData.append('password', $password.value);

                        // Enviar las credenciales al servidor
                        fetch('/login', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => {
                            if (response.redirected) {
                                window.location.href = response.url;
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