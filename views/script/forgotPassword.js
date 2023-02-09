const forgotPassword = document.getElementById('retrievePassword');
forgotPassword.addEventListener('click', generatePassword);

async function generatePassword(){
    const email = document.getElementById('email').value
    const data = await axios.post('http://52.66.246.242:3000/password/forgotpassword', {email:email})
}