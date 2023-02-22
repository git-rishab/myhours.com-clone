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
        email: form.email.value,
        password: form.pass.value
    }
    request(data);

    async function request(userData) {
        try {
            let req = await fetch(`${url}/user/login`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(userData)
            })
            let res = await req.json();
            if (res.ok) {
                localStorage.setItem("token",res.token);
                localStorage.setItem("userData",JSON.stringify(res.userData));
                document.location.href = "./dashboard.html";
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