const url = `http://localhost:5000/`;
const form = document.querySelector("form");
const token = localStorage.getItem("token");
const projectData = JSON.parse(localStorage.getItem("project"));

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

let methods = {
    0:"member-based",
    1:"task-based",
    2:"project-based",
    3:"non-billable"
}
let calculationMethod = {
    0:"( member's billable rate   *   hours ) + expenses",
    1:"( task's billable rate   *   hours ) + expenses",
    2:"( billable rate   *   hours ) + expenses",
}
var method;
var coloured;

// Function calls
stylingOfBillableRate();
previousValue();


function stylingOfBillableRate() {
    let bills = document.getElementsByClassName("bill-child");
    let h4 = document.querySelectorAll(".bill-child h4");
    
    coloured = Object.keys(methods).find(key => methods[key] === projectData.billMethod);

    for(let i = 0; i < bills.length; i++){

        if(i == coloured){
            bills[i].style.border = "2px solid #3B8FC2";
            h4[i].style.color = "#3B8FC2";
        }
    
        bills[i].addEventListener("click",()=>{
            method = i;
            for(let j = 0; j < bills.length; j++){
                bills[j].style.border = "1px solid #DFDFDF";
                h4[j].style.color = "#687481";
            }
    
            bills[i].style.border = "2px solid #3B8FC2";
            h4[i].style.color = "#3B8FC2";
            
            let formula = document.getElementById("billable-rate");
            let h5 = document.getElementById("h5");
    
            if(method < 3){
                h5.innerHTML = "Calculation rule"
                formula.innerHTML = `Billable amount = ${calculationMethod[method]}`
            } else {
                h5.innerHTML = null;
                formula.innerHTML = null;
            }
    
        })
    }
}

function previousValue() {
    form.name.value = projectData.name;
    form.comment.value = projectData.description;
}

// Form EventListener
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(method == undefined){
        method = coloured
    }

    let projectDataa = {
        name:form.name.value,
        description:form.comment.value,
        billMethod: methods[method],
        _id:projectData._id
    }
    console.log(projectDataa);
    fetch(`${url}project/update`,{
        method:"PATCH",
        headers: {
            "content-type": "application/json",
            "authorization": token
        },
        body: JSON.stringify(projectDataa)
    })
    .then((raw)=> raw.json()).then((original)=>{
        if(original.ok){
            Swal.fire(
                `${original.msg}`,
                '',
                'success'
            )
            setTimeout(()=>{
                document.location.href = `./project.html`;
            },2500)
        }
    })
    .catch((err)=>{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong, Check console`
        })
        console.log("Error while creating project:-",err);
    });

});