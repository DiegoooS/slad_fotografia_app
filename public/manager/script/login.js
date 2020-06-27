const submitLogin = document.querySelector('.submit-login');
const emailInput = document.querySelector('#InputEmail');
const passwordInput = document.querySelector('#InputPassword');
const errorContainer = document.querySelector('.error-info');

checkIfLogged();

async function logIn() {

    const url = `${window.location.origin}/api/auth`;

    const fetchData = {
        method: 'POST',
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        }),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    };

    await fetch(url, fetchData)
    .then(function(response) {
        let status = response.status;
        response.text()
            .then((data) => {
                if(status != 200) errorContainer.innerHTML = data;
                else {
                    localStorage.setItem("x-auth-token", data);
                    checkIfLogged();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
    });
}

function checkIfLogged() {
    if(localStorage.getItem("x-auth-token")) window.location.replace(`${window.location.origin}/manager/gallery/`);
}

submitLogin.addEventListener('click', logIn);