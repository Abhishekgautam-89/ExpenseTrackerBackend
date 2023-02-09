const logOut = document.getElementById("logout");
const submit = document.getElementById("submit");
const editBtn = document.getElementById("edit");
const rzb = document.getElementById("rzp-button");
const viewReport = document.getElementById("viewReport");
const leaderBoardButton = document.getElementById("leaderboard");
const download = document.getElementById("download");
var itemsPerPage = document.getElementById('itemsPerPage');

download.addEventListener("click", downloadReport);
rzb.addEventListener("click", buyPremium);
leaderBoardButton.addEventListener("click", leaderBoard);

logOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "../view/login.html";
});
document.addEventListener("DOMContentLoaded", (e) => {
  let page = 1;
  getExpense(page);
});

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// document.getElementById("page1").addEventListener("click", () => {
//   getExpense(1);
// });
// document.getElementById("page2").addEventListener("click", () => {
//   getExpense(2);
// });

submit.addEventListener("click", async (e) => {
  // console.log('clicked')
  e.preventDefault();
  const expense = document.getElementById("expense").value;
  const description = document.getElementById("desc").value;
  const select = document.getElementById("category");
  const selectValue = select.options[select.selectedIndex].value;
  const obj = {
    expense: expense,
    description: description,
    option: selectValue,
  };

  addDatatoList(obj);
  try {
    const token = localStorage.getItem("token");
    let postObject = await axios.post("http://65.0.105.193:3000/addexpense", obj, {
      headers: { Authorization: token },
    });
    // console.log(postObject.data);
    addDatatoList(postObject.data);
  } catch (error) {
    console.log(error);
  }
});

function addDatatoList(obj) {
  var list = document.getElementById("expenseList");
  var li = document.createElement("li");
  //var edit = document.createElement("button");
  var del = document.createElement("button");
  // list.innerHTML = " "
  li.appendChild(
    document.createTextNode(`${obj.expense} ${obj.description} ${obj.option}`)
  );
  li.id = obj.id;
    
  //   edit.appendChild(document.createTextNode("Edit"));
  del.appendChild(document.createTextNode("Delete"));

  //   edit.addEventListener("click", () => {
  //     document.getElementById("desc").value = obj.description;
  //     document.getElementById("expense").value = obj.expense;
  //     document.getElementById("opt").value = obj.option;
  //     // li.remove();
  //     // localStorage.removeItem(obj.description);
  //     editBtn.disabled = false;

  //     editBtn.addEventListener("click", () => {
  //       editList();
  //     });
  //   });

  //   li.appendChild(edit);
  li.appendChild(del);

  del.addEventListener("click", () => {
    deleteList(obj.id);
  });

  list.appendChild(li);
}

async function deleteList(id) {
  // console.log('delete-clicked')
  try {
    const token = localStorage.getItem("token");

    const delObj = await axios.delete(`http://65.0.105.193:3000/delete/${id}`, {
      headers: { Authorization: token },
    });
    li.remove();
  } catch (error) {
    console.log(error);
  }
}

async function editList(id) {
  let expense = document.getElementById("expense").value;
  var description = document.getElementById("desc").value;
  var select = document.getElementById("category");
  var selectValue = select.options[select.selectedIndex].value;
  var objec = {
    expense: expense,
    description: description,
    option: selectValue,
  };
  try {
    console.log(obj.id);
    const updateData = await axios({
      method: "put",
      url: `http://65.0.105.193:3000/edit/${id}`,
      data: objec,
    });
    addDatatoList(updateData);
    editBtn.disabled = true;
  } catch (error) {
    console.log(error);
  }
}

async function getExpense(page) {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  // console.log(decodedToken);
  //to get no.of rows per page
   const value=localStorage.getItem("page")
  // console.log(value);
  try {
    const getObject = await axios.get(
      `http://65.0.105.193:3000/getexpense?page=${page}`,
      { headers: { Authorization: token, page:value } }
    );
    // console.log(getObject.data.listOfUrls);
    document.getElementById("report-table").innerHTML = " ";
    document.getElementById("expenseList").innerHTML = " ";

    for (let i = 0; i < getObject.data.allExpense.length; i++) {
      
      addDatatoList(getObject.data.allExpense[i]);
      dataToReport(getObject.data.allExpense[i]);
    }

    document.getElementById("urlList").innerHTML = " "
   

    for (let i = 0; i < getObject.data.listOfUrls.length; i++) {
      listOfUrls(getObject.data.listOfUrls[i]);
    }    
    showPagination(      
      getObject.data.currentPage,
      getObject.data.hasNextPage,
      getObject.data.nextPage,
      getObject.data.hasPreviousPage,
      getObject.data.previousPage,
      getObject.data.lastPage
    );

    if (decodedToken.isPremium === true) {
      rzb.style.display = "none";
      document.getElementById("display").style.display = "block";
      document.getElementById("leaderboard").style.display = "block";
    }
  } catch (reject) {
    console.log(`Something goes wrong and gives this error: ${reject} `);
  }
}

var itemsPerPageOptions = document.getElementById('itemsPerPageOptions')
itemsPerPageOptions.addEventListener('change',()=>{
  const value = itemsPerPageOptions.value||20    
  localStorage.setItem("page", value); 
  getExpense(1)
})

async function buyPremium() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://65.0.105.193:3000/getPremium", {
      headers: { Authorization: token },
    });
    // console.log(res);
    var options = {
      keys: res.data.key_id,
      order_id: res.data.order.id,
      handler: async (response) => {
        // console.log(options.order_id);
        const res = await axios.post(
          "http://65.0.105.193:3000/updateStatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("you are a premium user now");
        premiumFeature();
        localStorage.setItem("token", res.data.token);
      },
    };
    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      console.log(response);
      alert("something went wrong");
    });
  } catch (err) {
    console.log(err);
  }
}

async function leaderBoard() {
  try {
    const token = localStorage.getItem("token");
    const data = await axios.get(
      "http://65.0.105.193:3000/premium/showLeaderboard",
      { headers: { Authorization: token } }
    );
    // console.log(data.data.expense);
    const lists = data.data.expense;
    lists.forEach((list) => {
      leaderBoardOnScreen(list);
    });
  } catch (err) {
    console.log(err);
  }
}

function leaderBoardOnScreen(data) {
  console.log(data);
  const ul = document.getElementById("leaderBoard");
  const li = document.createElement("li");
  li.appendChild(
    document.createTextNode(
      `Name: ${data.name}   Expense: ${data.total_expense}`
    )
  );
  ul.appendChild(li);
}

async function dataToReport(data) {
  // console.log(data);
  const table = document.getElementById("report-table");
  
  table.innerHTML += `
  <tr>
  <td>${data.id}</td>
  <td>${data.createdAt}</td>
  <td>${data.option}</td>
  <td>${data.description}</td>
  <td>${data.expense}</td>
</tr>
  `;
  // table.appendChild(table_row);
}

function premiumFeature() {
  rzb.style.display = "none";
  document.getElementById("display").style.display = "block";
  viewReport.style.display = "block";
}

async function downloadReport() {
  try {
    const token = localStorage.getItem("token");
    const data = await axios.get("http://65.0.105.193:3000/download", {
      headers: { Authorization: token },
    });
    // console.log(data);
    if (data.status === 201) {
      var a = document.createElement("a");
      a.href = data.data.URL;
      a.download = "fileExpense.csv";
      a.click();
    } else {
      throw new Error(data.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}

function listOfUrls(data) {
  const urlList = document.getElementById("urlList");
  var date = new Date(data.createdAt);
  // urlList.innerHTML = " "
  urlList.innerHTML += `
    <li><a href="${data.url}" download='fileExpense.csv' >Last Download On: ${date}</a></li> 
    `;
}

function showPagination(
  currentPage,  
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
) {
  pagination.innerHTML = " ";

  const button4 = document.createElement('button');
  button4.classList.add("active");
  button4.innerHTML = `<h3>First Page<h3>`;
  button4.addEventListener("click", () => getExpense(1));
  pagination.appendChild(button4);

  if (hasPreviousPage) {
    const button2 = document.createElement("button");
    button2.classList.add("active");
    button2.innerHTML = previousPage;
    console.log(previousPage);
    button2.addEventListener("click", () => getExpense(previousPage));
    pagination.appendChild(button2);
  } 

  const button1 = document.createElement("button");
  button1.classList.add("active");
  button1.innerHTML = `<h3>${currentPage}<h3>`;

  button1.addEventListener("click", () => getExpense(currentPage));
  pagination.appendChild(button1);

  

  if (hasNextPage) {
    const button3 = document.createElement("button");
    button3.classList.add("active");
    button3.innerHTML = nextPage;
    button3.addEventListener("click", () => getExpense(nextPage));
    pagination.appendChild(button3);
  }

  const button5 = document.createElement('button');
  button5.classList.add("active");
  button5.innerHTML = `<h3>Last Page<h3>`;
  button5.addEventListener("click", () => getExpense(lastPage));
  pagination.appendChild(button5);

}


