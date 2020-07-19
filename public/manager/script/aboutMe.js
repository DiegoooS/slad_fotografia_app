const logoutButton = document.querySelector('.logout_button');
const textContainer = document.querySelector('.p-main__form__aboutMe');
const updateTextButton = document.querySelector('.update__text__button');

async function getText() {
    checkIfLogged();
    await fetch(`${window.location.origin}/api/me`)
    .then((resp) => resp.json())
    .then((data) => {
        textContainer.value = data[0].text;
    })
    .catch((err) => {
        console.log(err);
    });
}
getText();

async function updateText() {
    checkIfLogged();
    const url = `${window.location.origin}/api/me/5ee93e82d6ea1c0b50f08f1b`;

    const fetchData = {
        method: 'PUT',
        body: JSON.stringify({ text: textContainer.value }),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': `${localStorage.getItem('x-auth-token')}`
        }
    };

    await fetch(url, fetchData)
    .then(function(response) {
        let status = response.status;
        response.text()
        .then((data) => {
            if(status != 200) { console.log(data); }
            else window.location.reload(true);
        })
        .catch((err) => { console.log(err); });
    });
}

function checkIfLogged() {
    if(!localStorage.getItem("x-auth-token")) logout();
}

function logout() {
    localStorage.clear();
    window.location.replace(`${window.location.origin}/manager`);
}

updateTextButton.addEventListener('click', updateText);
logoutButton.addEventListener('click', logout);