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
const userData = JSON.parse(localStorage.getItem("userData"));
const token = localStorage.getItem("token");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    userData.password = form.pass.value;
    request(userData);

    async function request(userData) {
        try {
            let req = await fetch(`${url}/member/update`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify(userData)
            })
            let res = await req.json();
            if (res.ok) {
                Swal.fire(
                    `Welcome To Work Flow`,
                    '',
                    'success'
                )
                setTimeout(()=>{
                    document.location.href = "./memberDashboard.html";
                },2500)
            } else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${res.msg}`,
                })
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