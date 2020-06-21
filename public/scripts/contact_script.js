const loading = document.querySelector('.p-loading');

window.addEventListener('load', () => {loading.style.opacity = '0';});
loading.addEventListener('transitionend', () => {loading.style.display = 'none'});