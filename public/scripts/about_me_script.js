const loading = document.querySelector('.p-loading');
const text = document.querySelector('.aboutMe-main-text');

async function getText() {
    await fetch(`${window.location.origin}/api/me`)
        .then((resp) => resp.json())
        .then((data) => {
            text.innerHTML = data[0].text;
        })
        .catch((err) => {
            console.log(err);
        });
}
getText();

window.addEventListener('load', () => {loading.style.opacity = '0';});
loading.addEventListener('transitionend', () => {loading.style.display = 'none'});