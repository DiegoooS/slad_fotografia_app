
const info = document.querySelector('.contact-main__info');
const loading = document.querySelector('.p-loading');
const emailInput = document.querySelector('.contact-main__form__email');
const nameInput = document.querySelector('.contact-main__form__name');
const textInput = document.querySelector('.contact-main__form__text');
const submitMail = document.querySelector('.contact-main__form__submit');

async function sendEmail() {
    if (localStorage.getItem("sended")) {
        info.style.display = 'block';
        info.innerHTML = 'Już otrzymałam jedną wiadomość. Odpiszę najszybciej jak będę mogła :). <br /><small>Jeżeli masz coś dodania możesz się ze mną skontaktować pod adresem email: slad.fotografia@gmail.com</small>';
    }
    else {
        const url = `${window.location.origin}/api/mail`;

    const fetchData = {
        method: 'POST',
        body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            text: textInput.value
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    fetch( url, fetchData)
      .then(response => {
        let status = response.status;
        response.text()
            .then(data => {
                if(status != 200) {
                    info.style.display = 'block';
                    info.innerHTML = 'Coś poszło nie tak, spróbuj ponownie :( <br /><small>Jeżeli wciąż nie możesz się ze mną skontaktować napisz do mnie na adres email: slad.fotografia@gmail.com</small>';
                }
                else {
                    localStorage.setItem('sended', true);
                    info.style.display = 'block';
                    info.innerHTML = 'Dziękuję za kontakt. Odpiszę najszybciej jak będę mogła :) <br /><small>Jeżeli masz coś dodania możesz się ze mną skontaktować pod adresem email: slad.fotografia@gmail.com</small>';
                }
            })
            .catch(error => {
            });
      });
    }
}

window.addEventListener('load', () => {loading.style.opacity = '0';});
loading.addEventListener('transitionend', () => {loading.style.display = 'none';});
submitMail.addEventListener('click', sendEmail);