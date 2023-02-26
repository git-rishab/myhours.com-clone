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
const memberData = JSON.parse(localStorage.getItem("member"));
const token = localStorage.getItem("token");
const form = document.querySelector("form");

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

let roles = {
    0:"admin",
    1:"manager",
    2:"normal"
}

var roleSelected;
var colured;

// Function calls
stylingOfBillableRate();
details();

function stylingOfBillableRate() {
    let bills = document.getElementsByClassName("roles");
    let h4 = document.querySelectorAll(".roles h4");
    
    colured = Object.keys(roles).find(key => roles[key] === memberData.role);
    
    for(let i = 0; i < bills.length; i++){
        if(i == colured){
            bills[i].style.border = "2px solid #3B8FC2";
            h4[i].style.color = "#3B8FC2";
        }

        bills[i].addEventListener("click",()=>{
            roleSelected = i;
            colured = null;
            for(let j = 0; j < bills.length; j++){
                bills[j].style.border = "1px solid #DFDFDF";
                h4[j].style.color = "#687481";
            }
    
            bills[i].style.border = "2px solid #3B8FC2";
            h4[i].style.color = "#3B8FC2";
        })
    }
}

// Predefined values
function details() {
    form.name.value = memberData.name;
    form.email.value = memberData.email;
    form.laborRate.value = memberData.labourRate;
    form.billableRate.value = memberData.billableRate;
}


// Form EventListener
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(roleSelected == undefined){
        roleSelected = colured
    }

    let memberDataa = {
        name:form.name.value,
        email:form.email.value,
        labourRate:form.laborRate.value,
        billableRate:form.billableRate.value,
        role:roles[roleSelected],
        _id:memberData._id
    }

    fetch(`${url}member/update`,{
        method:"PATCH",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(memberDataa)
    })
    .then((raw)=> raw.json()).then((original)=>{
        if(original.ok){
            Swal.fire(
                `${original.msg}`,
                '',
                'success'
            );
            setTimeout(()=>{
                document.location.href = "./team.html";
            },2500)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${original.msg}`
            })
        }
    })
    .catch((err)=>{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong, Check console`
        })
        console.log("Error while updating member:-",err);
    });

});