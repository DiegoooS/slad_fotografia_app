const headerBg = document.querySelector('.p-header__bg');
const headerContentElement = document.querySelectorAll('.p-header__content__element')
const newsImageHover = document.querySelectorAll('.news__image__hover');
const navbar = document.querySelector('.p-header__navbar');
const loading = document.querySelector('.p-loading');
const imagesButton = document.querySelectorAll('.p-main__images__button');
const aboutMeButton = document.querySelector('.p-main__aboutme__button');
const newImages = document.querySelectorAll('.p-main__images__row__item_image');

//Modal
const imageModal = document.querySelector('.p-modal');
const openModalImages = document.querySelectorAll('.open-modal');
const closeModal = document.querySelector('.p-modal__close');
const modalBg = document.querySelector('.p-modal__bg');
const srcModalImage = document.querySelector('.p-modal__image');

async function getNewImages() {
  await fetch(`${window.location.origin}/api/pictures`)
        .then((resp) => resp.json())
        .then((data) => {
            let counter = 0;
            newImages.forEach(item => {
              item.src = data.length > counter ? `../../uploads/${data[counter].filename}` : `../../uploads/blank.png`;
              counter++;
            });
        })
        .catch((err) => {
            console.log(err);
        });
}
getNewImages();

function changeHeaderTheme() {
    console.log(this);
    headerContentElement.forEach(noActive => noActive.classList.remove('p-header__content__element__active'));
    this.classList.add('p-header__content__element__active');

    this.classList.contains('header__content__people') ? headerBg.style.backgroundImage = 'url(styles/Images/header_gallery/zdj_3.jpg)' : null;
    this.classList.contains('header__content__nature') ? headerBg.style.backgroundImage = 'url(styles/Images/header_gallery/zdj_17.jpg)' : null;
    this.classList.contains('header__content__travel') ? headerBg.style.backgroundImage = 'url(styles/Images/header_gallery/zdj_13.jpg)' : null;
}

function debounce(func, wait = 14, immediate = true) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

 function stickyNavOnScroll() {
     window.scrollY > 0 ? navbar.classList.add('fixed-top', 'bg-dark') : navbar.classList.remove('fixed-top', 'bg-dark');
 }

 function openModal() {
    imageModal.style.display = 'flex';
    srcModalImage.src = this.childNodes[3].src;
    setTimeout(() => {srcModalImage.style.transform = 'scale(1)';}, 100);
 }


openModalImages.forEach(image => image.addEventListener('click', openModal));
closeModal.addEventListener('click', () => {imageModal.style.display = 'none'; srcModalImage.style.transform = 'scale(0)';});
modalBg.addEventListener('click', () => {imageModal.style.display = 'none'; srcModalImage.style.transform = 'scale(0)';});
headerContentElement.forEach(element => element.addEventListener('mouseover', changeHeaderTheme));
window.addEventListener('scroll', debounce(stickyNavOnScroll));
window.addEventListener('load', () => {loading.style.opacity = '0';});
loading.addEventListener('transitionend', () => {loading.style.display = 'none'});
imagesButton.forEach(button => button.addEventListener('click', () => {window.open("Gallery/" , "_self");}))
aboutMeButton.addEventListener('click', () => {window.open("about_me/" , "_self");});