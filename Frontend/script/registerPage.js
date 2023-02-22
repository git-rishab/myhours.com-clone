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

const url = `http://localhost:5000`;
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
        name: form.name.value,
        email: form.email.value,
        password: form.pass.value,
        role: "admin",
        company: form.companyName.value
    }
    request(data);

    async function request(userData) {
        try {
            let req = await fetch(`${url}/user/register`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(userData)
            })
            let res = await req.json();
            if (res.ok) {
                Swal.fire(
                    `${res.msg}`,
                    '',
                    'success'
                )
                setTimeout(()=>{
                    document.location.href = "./loginPage.html";
                },2500)
            } else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${res.msg}`,
                    footer: '<a href="./loginPage.html">Login Now?</a>'
                })
                setTimeout(()=>{
                    document.location.href = "./loginPage.html";
                },2500)
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Server taking longer than expected`,
            })
        }
    }
})