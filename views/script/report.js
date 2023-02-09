

// const download = document.getElementById('download');
window.addEventListener('DOMContentLoaded',()=>{
    const object = {
        id: '1',
        createdAt: '12-12-2000',
        option: 'car',
        description: 'hgfjs',
        expense: '500'
    }
    dataToReport(object);
})

async function dataToReport(data){
    console.log(data);
    const table = document.getElementById('report-table');
    table.innerHTML+= `
    <tr>
    <td>${data.id}</td>
    <td>${data.createdAt}</td>
    <td>${data.option}</td>
    <td>${data.description}</td>
    <td>${data.expense}</td>
  </tr>
    `
    // table.appendChild(table_row);
  }
