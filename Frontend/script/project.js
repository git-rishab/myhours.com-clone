// Loader
document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".boxes").style.visibility = "visible";
    } else {
        document.querySelector(".boxes").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};

const url = `http://localhost:5000/`;
const token = localStorage.getItem("token");

const dataContainer = document.getElementById("data-container");
const search = document.getElementById("search");
const userData = JSON.parse(localStorage.getItem("userData"));

// Checking if user logged in
if (!token) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please Login First`,
        footer: '<a href="./loginPage.html">Login Now?</a>'
    });
    setTimeout(() => {
        document.location.href = "./loginPage.html";
    }, 2500)
}

// Functions calls
fetching();


async function fetching() {
    try {
        let request = await fetch(`${url}project/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        })
        let response = await request.json();
        if (!response.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${response.msg}`
            });
            return;
        }
        let data = response.data;

        createDOM(data);
        seacrh(data);

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong, check console`
        });
        console.log(error);
    }
}

async function createDOM(data) {
    dataContainer.innerHTML = null;

    if (data.length == 0) {
        dataContainer.innerHTML = `<p id="no-project">Please Add Projects :(</p>`
        return;
    }
    let req = await fetch(`${url}total/`,{
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body:JSON.stringify(userData)
    });
    let res = await req.json();
    let result = res.data.data;
    // console.log(result);
    dataContainer.innerHTML = data.map((el, i) => {
        let hour;
        let bill;
        if(result){
            hour = result[el.name.split(" ").join("")].total
            bill = result[el.name.split(" ").join("")].billAmt;
        } else {
            hour = "-"
            bill = 0
        }
        return `
        <div class="table card" data-id="${i}">
            <div class="time project-title"><u>${el.name}</u></div>
            <div class="time">${el.created}</div>
            <div class="time bills">₹${bill}</div>
            <div class="time bills">${timeFormatting(hour)}H</div>
            <div class="time action" style="margin-right: 0px;">
                <div class="edit">Edit</div>
                <div class="delete">Delete</div>
            </div>
        </div>`
    }).join("");
    editingData(data);
    eventListener(data);
}

// Time Formatting Function
function timeFormatting(sum) {
    sum = sum + "";
    if(sum == "-"){
        return "00:00";
    }
    if (sum.length == 1) {
        sum = `00:0${sum[0]}`;
    } else if (sum.length == 2) {
        sum = `00:${sum[0]}${sum[1]}`
    } else if (sum.length == 3) {
        sum = `0${sum[0]}:${sum[1]}${sum[2]}`;
    } else {
        sum = `${sum[0]}${sum[1]}:${sum[2]}${sum[3]}`;
    }
    return sum;
}

// Editing and Deleting Functionality
function editingData(data) {
    let edit = document.getElementsByClassName("edit");
    let del = document.getElementsByClassName("delete");

    for (let i = 0; i < edit.length; i++) {

        // Editing Functionality
        edit[i].addEventListener("click", () => {
            localStorage.setItem("project", JSON.stringify(data[edit[i].parentNode.parentNode.dataset.id]));
            document.location.href = "./editProject.html";
        });

        // Delete functionality
        del[i].addEventListener("click", () => {
            let deleteData = data[del[i].parentNode.parentNode.dataset.id];
            
            // Warning
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteRequest();
                    Swal.fire(
                        'Deleted!',
                        'Project has been Deleted.',
                        'success'
                    )
                }
            })
            // Deleting
            async function deleteRequest() {
                try {
                    let request = await fetch(`${url}project/delete`, {
                        method: "DELETE",
                        headers: {
                            "content-type": "application/json",
                            "authorization": token
                        },
                        body: JSON.stringify(deleteData)
                    })
                    let response = await request.json();
                    if (!response.ok) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `${response.msg}`
                        });
                        return;
                    }
                    fetching();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `Something went wrong, check console`
                    });
                    console.log(error);
                }
            }
        })
    }
}

// Searching Functionality
function seacrh(data) {

    search.addEventListener("keyup", () => {
        let newData = data.filter(el => {
            if (el.name.toLowerCase().includes(search.value.toLowerCase())) {
                return true;
            }
            return false;
        });
        createDOM(newData);
    })
}

function eventListener(data){
    const card = document.getElementsByClassName("card");
    const name = document.getElementsByClassName("project-title")
    for(let i = 0; i < data.length; i++){
        card[i].addEventListener("click",()=>{
            localStorage.setItem("projectData",JSON.stringify(data[card[i].dataset.id]));
        })
        name[i].addEventListener("click",()=>{
            document.location.href = `./projectDesc.html`;
        })
    }
}