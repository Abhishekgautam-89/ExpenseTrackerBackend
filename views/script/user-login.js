const register = document.getElementById('register');
const login = document.getElementById('login');


register.addEventListener('click', (e)=>{
    e.preventDefault();
    window.location.href="../view/signUp.html"
})

login.addEventListener('click', getUserDetails);

async function getUserDetails(){
    const userEmail = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const userDetails = {        
        userEmail: userEmail,
        userPassword: password,
      };

    try{
        const details = await axios.post(`http://65.0.105.193:3000/user/login`,userDetails)
        // console.log(details.data);    
        localStorage.setItem('token', details.data.token)
        window.alert('Login Successfull'); 
        window.location.href='../view/index.html'
    }
    catch(err){
        if (err.response.status==401){
            window.alert('User Details In-correct')
        }
        else if(err.response.status==404) {
            window.alert('User not registered')
        }
    }
}

