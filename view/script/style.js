const viewreport = document.getElementById('viewReport');
const close = document.getElementById('close');
const container = document.getElementById('table');


viewreport.addEventListener('click',()=>{
    // console.log('clicked')
    container.classList.add('active');
})   

close.addEventListener('click',()=>{
    container.classList.remove('active');
})  