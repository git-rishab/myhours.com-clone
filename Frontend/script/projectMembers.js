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

const container2 = document.getElementById("container2");
const search = document.getElementById("search");
const container = document.getElementById("container");
const projectData = JSON.parse(localStorage.getItem("projectData"));
let presentProject;

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

// Function calls
addedMembers();
availableMembers();

document.getElementById("project-name").innerHTML = projectData.name;


async function availableMembers() {
    try {
        let request = await fetch(`${url}member/`, {
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
            })
        }
        createDOM(response.data);
        seacrh(response.data);

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong, check console`
        })
        console.log(error);
    }
}

function createDOM(data) {
    container2.innerHTML = null;
    let roles = {
        "admin":"Administrator",
        "manager":"Manager",
        "normal":"Normal Member"
    }

    container2.innerHTML = data.map((el,i)=>{
        return `
        <div class="card2" data-id="${i}">
            <div>${el.name}</div>
            <div>${roles[el.role]}</div>
            <div id="add"><u> Add to project</u></div>
        </div>`
    }).join("");

    addNow(data);
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

// Added Memebrs
async function addedMembers() {
    try {
        let request = await fetch(`${url}project/members?id=${projectData._id}`, {
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
            })
        }
        presentProject = response.payLoad;
        createDOM2(response.payLoad.team);
        remove(response.payLoad.team);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong, check console`
        })
        console.log(error);
    }   
}

function createDOM2(data) {
    container.innerHTML = null;
    let roles = {
        "admin":"Administrator",
        "manager":"Manager",
        "normal":"Normal Member"
    }
    if(data.length == 0){
        container.innerHTML = `<p id="no-member">No Member Has been added</p>`
        return;
    }

    container.innerHTML = data.map((el,i)=>{
        return `
        <div class="card" data-id="${i}">
            <div>${el.name}</div>
            <div>${el.labourRate}</div>
            <div>${roles[el.role]}</div>
            <div class="remove">Remove from project</div>
        </div>
        `
    }).join("");
}

// Removing Functionality
function remove(data) {
    let rmv = document.getElementsByClassName("remove");

    for(let el of rmv){
        el.addEventListener("click", async()=>{

            projectData.team.splice(el.parentNode.dataset.id,1);

            let req = await fetch(`${url}project/update`,{
                method:"PATCH",
                headers: {
                    "content-type": "application/json",
                    "authorization": token
                },
                body:JSON.stringify(projectData)
            })
            let res = await req.json();
            addedMembers();
        })
    }
}

function addNow(data) {
    let card2 = document.getElementsByClassName("card2");

    for(let el of card2){
        el.addEventListener("click",async()=>{
            try {
                let check = true;
                presentProject.team.forEach((ele)=>{
                    if(ele._id == data[el.dataset.id]._id){
                        check = false;
                        return;
                    }
                })
                
                if(!check) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `Member already added`
                    })
                    return;
                }

                presentProject.team.push(data[el.dataset.id]);

                let request = await fetch(`${url}project/update`,{
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        "authorization": token
                    },
                    body:JSON.stringify(presentProject)
                })
                let response = await request.json();

                if (!response.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `${response.msg}`
                    })
                }
                addedMembers();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Something went wrong, check console`
                })
                console.log(error);
            }
        })
    }
}

// Done
document.getElementById("done").addEventListener("click",()=>{
    Swal.fire(
        `Members Edited Successfully`,
        '',
        'success'
    )
    setTimeout(()=>{
        document.location.href = `./project.html`;
    },2500)
})
