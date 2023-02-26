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
const form = document.querySelector("form");
const token = localStorage.getItem("token");
const projectData = JSON.parse(localStorage.getItem("projectData"));
const userData = JSON.parse(localStorage.getItem("userData"));

// Checking if user logged in
if(!token){
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
document.getElementById("user-name").innerText = userData.name;
// Function calls
fetchTasks();

document.getElementById("project-title").innerText = projectData.name;
document.getElementById("description").innerText = projectData.description;

// Creating and appending the data
function createDomMember(data, cont, className, takeInput, boxToHide) {
    cont.innerHTML = null;
    data.forEach(el => {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        div.innerHTML = `${el.name}`;

        // Individual Option selecting and changing the input and selected value
        div.addEventListener("click", () => {
            takeInput.innerHTML = el.name;
            takeInput.value = el.name;
            boxToHide.style.visibility = "hidden";
            takeInput.disabled = false;
        })
        cont.append(div);
    });
}

// Get Request function
async function fetching(route, className, container, searchCont, takeInput, boxToHide) {
    try {
        let request = await fetch(`${url}${route}/members?id=${projectData._id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        });
        var response = await request.json();
        createDomMember(response.payLoad.team, container, className, takeInput, boxToHide);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong with Server`,
        });
        console.log(error);
    }
    // Member Search functionality
    searchCont.addEventListener("keyup", () => {
        let newData = response.payLoad.team.filter(el => {
            if (el.name.toLowerCase().includes(searchCont.value.toLowerCase())) {
                return true;
            }
            return false;
        })
        createDomMember(newData, container, className, takeInput, boxToHide);
    })
}

// Show total members
document.getElementById("assign").addEventListener("click", () => {
    let cont = document.getElementById("member-data");
    let searchMember = document.getElementById("search-member");
    let assign = document.getElementById("assign");
    let box = document.getElementById("member-box");
    box.style.visibility = "visible";
    fetching("project", "names", cont, searchMember, assign, box);
    boxVisibility("member-box", "assign", "#");
})

// Box Visibility and Hiding
function boxVisibility(boxToHide, exception, selector, enableTakingInput) {
    
    // Select element with box class, assign to box variable
    const box = document.querySelector(`#${boxToHide}`)
    // Detect all clicks on the document
    document.addEventListener("click", (event) => {
        // If user clicks inside the element, do nothing
        if (event.target.closest(`#${boxToHide}`) || event.target.closest(`${selector}${exception}`)) return
        // If user clicks outside the element, hide it!
        box.style.visibility = "hidden"
        enableTakingInput.disabled = false;
    })
}

// Form Inputs
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let tasks= {
        task:form.task.value,
        assign:form.assign.value
    }
    projectData.tasks.push(tasks);

    fetching(projectData);
    
    async function fetching(projectData) {
        try {
            let req = await fetch(`${url}project/update`,{
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "authorization": token
                },
                body:JSON.stringify(projectData)
            })
            let res = await req.json();
            if(res.ok){
                Swal.fire(
                    `Task Assigned successfully`,
                    '',
                    'success'
                )
                fetchTasks();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Something went wrong with Server`,
                });
                console.log(error);
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something went wrong, check console`,
            });
            console.log(error);
        }
    }
})

async function fetchTasks() {
    try {
        let request = await fetch(`${url}project/members?id=${projectData._id}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        });
        let res = await request.json();
        createTasksDOM(res.payLoad.tasks);

    } catch (error) {
        console.log(error);
    }
}

function createTasksDOM(data){
    const container = document.getElementById("append-tasks");
    container.innerHTML = null;
    if(data.length == 0){
        container.innerHTML = `<p id="no-task">No Task Has been added</p>`
        return;
    }

    container.innerHTML = data.map(el =>{
        return `
        <div class="card">
            <div>Task:-  ${el.task}</div>
            <div>Assigned to:-  ${el.assign}</div>
        </div>
        `
    }).join("");
}
totalTime()
async function totalTime() {
    let req = await fetch(`${url}total/`,{
        method:"POST",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body:JSON.stringify(userData)
    })
    let res = await req.json();
    console.log(res);
    let data = res.data.data[projectData.name.split(" ").join("")];

    document.getElementById("hours").innerText = `${timeFormatting(data.total)}H`;
    document.getElementById("bill").innerText = `₹${data.billAmt}`
    document.getElementById("bill-hours").innerText = `${timeFormatting(data.total)}H`
    document.getElementById("cost").innerText = `₹${data.costAmt}`
}

// Time Formatting Function
function timeFormatting(sum) {
    sum = sum + "";
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