// Required variable Declarations
const url = `http://localhost:5000/`;
let userData = JSON.parse(localStorage.getItem("userData"));
let token = localStorage.getItem("token");

// Checking if user logged in
fetch(`${url}project/checking`,{
    method:"GET",
    headers: {
        "content-type": "application/json",
        "authorization": token
    }
}).then((raw)=> raw.json()).then((original)=>{
    console.log(original);
    if(!original.ok){
        console.log("here");
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Please Login First`,
            footer: '<a href="./loginPage.html">Login Now?</a>'
        });
        setTimeout(()=>{
            document.location.href = "./loginPage.html";
        },2500)
    }
}).catch((err)=> err);


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
function createDomMember(data, cont, className) {
    cont.innerHTML = null;
    data.forEach(el => {
        let div = document.createElement("div");
        div.setAttribute("class", className);
        div.innerHTML = `${el.name}`;
        cont.append(div);
    });
}

// Get Request function
async function fetching(route, className, container, searchCont) {
    try {

        let request = await fetch(`${url}${route}/`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": token
            }
        });

        let response = await request.json();
        createDomMember(response, container, className);

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong with Server`,
        })
    }

    // Member Search functionality
    searchCont.addEventListener("keyup", () => {
        let newData = response.filter(el => {
            if (el.name.toLowerCase().includes(searchCont.value.toLowerCase())) {
                return true;
            }
            return false;
        })
        createDomMember(newData, container, className);
    })
}

// Show total members
document.getElementById("user2").addEventListener("click", () => {
    let cont = document.getElementById("member-data");
    let searchMember = document.getElementById("search-member");
    document.getElementById("member-box").style.visibility = "visible";

    fetching("member", "names", cont, searchMember);

    // Fetching data of members

    var wrapper = document.querySelector('body');
    document.addEventListener('click', (e)=> {
        if (!wrapper.contains(e.target) ) {
            // Do something when user clicked outside of wrapper element
            document.getElementById("member-box").style.visibility = "hidden";
            console.log("HI");
        }
    })
})

// Show Projects
function projects() {

    let input = document.getElementsByClassName("first-col");
    let cont = document.getElementById("project-box");
    let searchProject = document.getElementById("project-search");
    for (let i = 0; i < input.length; i++) {

        input[i].addEventListener("click", () => {

            fetching("project","names",cont,searchProject);
        })
    }

}
projects()