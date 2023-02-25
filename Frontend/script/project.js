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
        dataContainer.innerHTML = `<p id="no-member">Please Add Members :(</p>`
        return;
    }

    dataContainer.innerHTML = data.map((el, i) => {
        return `
        <div class="table-data table" data-id=${i}>
            <div class="details" id="name">${el.name}</div>
            <div class="details">${el.email}</div>
            <!-- Data inject from data entered and date -->
            <div class="details rates">
            ₹${el.labourRate}
            </div>
            <div class="details rates">
            ₹${el.billableRate}
            </div>
            <div class="details" id="role" style="margin-right: 0px;">
            ${el.role}
            </div>
            <div class="details" style="margin-right: 0px;">
            <div id="action" class="action">
                <div class="edit">Edit</div>
                <div class="delete">Remove</div>
            </div>
            </div>
            <hr>
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
            localStorage.setItem("member", JSON.stringify(data[edit[i].parentNode.parentNode.parentNode.dataset.id]));
            document.location.href = "./editMember.html";
        });

        // Delete functionality
        del[i].addEventListener("click", () => {
            let deleteData = data[del[i].parentNode.parentNode.parentNode.dataset.id];
            
            // Warning
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, remove!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteRequest();
                    Swal.fire(
                        'Deleted!',
                        'Member has been removed.',
                        'success'
                    )
                }
            })

            // Deleting
            async function deleteRequest() {
                try {
                    let request = await fetch(`${url}member/delete`, {
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