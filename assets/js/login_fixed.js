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
                        // Redirigir a index.html con el parámetro de autenticación
                        window.location.href = "index.html?auth=true";
                }
            }
        })