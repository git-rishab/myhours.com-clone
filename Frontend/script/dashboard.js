// Required variable Declarations
const url = `http://localhost:5000/`;
let userData = JSON.parse(localStorage.getItem("userData"));
let token = localStorage.getItem("token");

// Checking if user logged in
fetch(`${url}project/checking`, {
    method: "GET",
    headers: {
        "content-type": "application/json",
        "authorization": token
    }
}).then((raw) => raw.json()).then((original) => {
    if (!original.ok) {
        console.log("here");
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
}).catch((err) => err);


let dt = new Date();
let month = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
}
let week = {
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri"
}

// Function Calls
calender();
dates();
members();
projects();
gettingData();
// timeInput();


function calender() {
    let left = document.getElementById("left-arrow");
    let right = document.getElementById("right-arrow");
    let cont = document.getElementById("calendar-data");
    let day = dt.getDay();
    let cnt = 0;

    // Main Logic
    if (!day) day = 1;
    while (day != 1) {
        cnt++;
        day--;
    }
    dt.setDate(dt.getDate() - cnt);

    function endDate() {
        dt.setDate(dt.getDate() + 4);
        return dt.getDate();
    }
    // Appending
    cont.innerHTML = `This week, ${dt.getDate()} ${month[dt.getMonth()]} - ${endDate()} ${month[dt.getMonth()]} ${dt.getFullYear()}`;
    dt.setDate(dt.getDate() - 4);


    // Left Arrow functionality
    left.addEventListener("click", () => {

        function changeDate2() {
            dt.setDate(dt.getDate() - 7);
            return dt.getDate();
        }
        cont.innerHTML = `${changeDate2()} ${month[dt.getMonth()]} - ${endDate()} ${month[dt.getMonth()]} ${dt.getFullYear()}`;
        dt.setDate(dt.getDate() - 4);
        dates();
    });

    // Right Arrow Functionality
    right.addEventListener("click", () => {

        function changeDate2() {
            dt.setDate(dt.getDate() + 7);
            return dt.getDate();
        }
        cont.innerHTML = `${changeDate2()} ${month[dt.getMonth()]} - ${endDate()} ${month[dt.getMonth()]} ${dt.getFullYear()}`;
        dt.setDate(dt.getDate() - 4);
        dates();
    });
}

function dates() {
    let dates = document.getElementsByClassName("date");
    let cnt = 1;
    let dayCnt;

    for (let i = 0; i < dates.length; i++) {
        if (i == 0) {
            dayCnt = 0;
        } else {
            dayCnt = 1;
        }
        dates[i].innerHTML = `${week[cnt++]}, ${changeDate(dayCnt)} ${month[dt.getMonth()]}`;
    }
    // Changing date back to normal
    dt.setDate(dt.getDate() - 4);

    function changeDate(num) {
        dt.setDate(dt.getDate() + num);
        return dt.getDate();
    }
}

function members() {
    let name = document.getElementById("userName");
    name.innerHTML = `${userData.name}`;
}

// Creating and appending the data
function createDomMember(data, cont, className,takeInput,boxToHide) {
    cont.innerHTML = null;
    data.forEach(el => {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        div.innerHTML = `${el.name}`;

        // Individual Option selecting and changing the input and selected value
        div.addEventListener("click",()=>{
            takeInput.innerHTML = el.name;
            takeInput.value = el.name;
            boxToHide.style.visibility = "hidden";
            takeInput.disabled = false;
        })
        cont.append(div);
    });
}

// Get Request function
async function fetching(route, className, container, searchCont,takeInput,boxToHide) {
    try {
        let request = await fetch(`${url}${route}/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        });
        var response = await request.json();
        createDomMember(response, container, className,takeInput,boxToHide);
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
        let newData = response.filter(el => {
            if (el.name.toLowerCase().includes(searchCont.value.toLowerCase())) {
                return true;
            }
            return false;
        })
        createDomMember(newData, container, className,takeInput,boxToHide);
    })
}

// Show total members
document.getElementById("user2").addEventListener("click", () => {
    let cont = document.getElementById("member-data");
    let searchMember = document.getElementById("search-member");
    let userName = document.getElementById("userName");
    let box = document.getElementById("member-box");
    box.style.visibility = "visible";
    fetching("member", "names", cont, searchMember,userName,box);
    boxVisibility("member-box", "user2", "#");
})


// Show Projects
function projects() {
    let input = document.getElementsByClassName("first-col");
    let cont = document.getElementById("project-box");
    let searchProject = document.getElementById("project-search");
    let projectOuterBox = document.getElementById("project-outer-box");

    for (let i = 0; i < input.length; i++) {
        input[i].addEventListener("click", () => {
            fetching("project", "names", cont, searchProject,input[i],projectOuterBox);
            
            projectOuterBox.style.visibility = "visible";

            // Adding required distance in pixel to project-outer-box div
            var distanceFromTop = input[i].getBoundingClientRect().top;
            projectOuterBox.style.top = `${distanceFromTop + 50}px`;
            input[i].disabled = true;
            boxVisibility("project-outer-box","first-col",".",input[i]);
        })
    }
}


// Box Visibility and Hiding
function boxVisibility(boxToHide, exception, selector,enableTakingInput) {
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


// Taking input of Day Time
function timeInput() {
    let date = document.getElementsByClassName("date");
    let projects = document.getElementsByClassName("first-col");
    let taskss = document.getElementsByClassName("second-col");
    let k = 0;
    let className;
    let clasesOfTime = {
        0:"first",
        1:"second",
        2:"third",
        3:"forth",
        4:"fifth"
    }
    let payLoad = {};
    for(let i = 0; i < date.length; i++){
        let dateKey = date[i].innerHTML.split(" ").join("");
        payLoad[dateKey] = [];

        className = document.getElementsByClassName(clasesOfTime[i]);
        for(let j = 0; j < className.length; j++){
            let tasks = {};
            if(className[j].value){
                tasks.project = projects[k].value;
                tasks.task = taskss[k].value;
                tasks.time = className[j].value;
                payLoad[dateKey].push(tasks);
            }
            k++;
        }
        k = 0;
    }
    return payLoad;
}

// Updatig time model function
async function updateTime(){
    let request = await fetch(`${url}time/update`,{
        method:"PATCH",
        headers:{
            "content-type": "application/json",
            "authorization": token
        },
        body: JSON.stringify({data:timeInput()})
    });
    let response = await request.json();
    console.log(response);
}


// Getting The time data of the user
async function gettingData() {
    try {
        let request = await fetch(`${url}time/`,{
            method:"GET",
            headers:{
                "content-type": "application/json",
                "authorization": token
            }
        });
        let response = await request.json();
        appendTime(response.data);
        
    } catch (error) {
        console.log("Something went wrong");
    }
}

// Apending the time to their respective boxes/places
function appendTime(data) {
    let date = document.getElementsByClassName("date");
    let projects = document.getElementsByClassName("first-col");
    let taskss = document.getElementsByClassName("second-col");
    let k = 0;
    let m = 0;
    let className;
    let clasesOfTime = {
        0:"first",
        1:"second",
        2:"third",
        3:"forth",
        4:"fifth"
    };
    // Finding the object element which have the required date
    let requiredDate = date[0].innerHTML.split(" ").join("");
    var dataObj;

    for(let el of data){
        if(el[requiredDate]){
            dataObj = el;
            break;
        }
    }
    if(!dataObj) return;

    // Main Logic to append the time data
    for(let i = 0; i < date.length; i++){
        let dateKey = date[i].innerHTML.split(" ").join("");
        className = document.getElementsByClassName(clasesOfTime[i]);
        for(let j = 0; j < className.length; j++){
            console.log(dateKey);
            if(!dataObj[dateKey][m]){
                break;
            }
            
            if(!taskss[k].value){
                projects[k].value = dataObj[dateKey][m].project;
                taskss[k].value = dataObj[dateKey][m].task;
                className[j].value = dataObj[dateKey][m].time;
                m++;
            } 
            else if(taskss[k].value == dataObj[dateKey][m].task && projects[k].value == dataObj[dateKey][m].project){
                className[j].value = dataObj[dateKey][m].time;
                m++;
            }
            k++;
        }
        m = 0;
        k = 0;
    }
}

// Updating time at regular time interval
// setInterval(()=>{
//     updateTime();
// },4000)