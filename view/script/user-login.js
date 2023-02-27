
const register = document.getElementById('register');
const login = document.getElementById('login');

import {default as ipAddress} from './exporter.js'

register.addEventListener('click', (e)=>{
    e.preventDefault();
    window.location.href="../views/signUp.html"
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
        const details = await axios.post(`${ipAddress}/user/login`,userDetails)
        // console.log(details.data);    
        localStorage.setItem('token', details.data.token)
        window.alert('Login Successfull'); 
        window.location.href='../views/main.html'
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

