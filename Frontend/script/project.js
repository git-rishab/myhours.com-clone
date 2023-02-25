const url = `http://localhost:5000/`;
const token = localStorage.getItem("token");

const dataContainer = document.getElementById("data-container");
const search = document.getElementById("search");

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

function createDOM(data) {
    dataContainer.innerHTML = null;

    if (data.length == 0) {
        dataContainer.innerHTML = `<p id="no-project">Please Add Projects :(</p>`
        return;
    }

    dataContainer.innerHTML = data.map((el, i) => {
        return `
        <div class="table card" data-id="${i}">
            <div class="time">${el.name}</div>
            <div class="time">${el.created}</div>
            <div class="time bills">${el.billMethod}</div>
            <div class="time bills">Total Hours</div>
            <div class="time action" style="margin-right: 0px;">
                <div class="edit">Edit</div>
                <div class="delete">Delete</div>
            </div>
        </div>`
    }).join("");
    editingData(data);
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