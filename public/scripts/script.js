
const headerBg = document.querySelector('.p-header__bg');
const headerContentElement = document.querySelectorAll('.p-header__content__element');
const newsImageHover = document.querySelectorAll('.news__image__hover');
const navbar = document.querySelector('.p-header__navbar');
const loading = document.querySelector('.p-loading');
const imagesButton = document.querySelectorAll('.p-main__images__button');
const aboutMeButton = document.querySelector('.p-main__aboutme__button');
const newImages = document.querySelectorAll('.p-main__images__row__item_image');

//New Galleries
const galleriesButtons = document.querySelectorAll('.p-main__galleries__button');
const newGalleryContainer = document.querySelectorAll('.p-main__images__row__item__gallery');
const newGalleryImages = document.querySelectorAll('.news_gallery_image_container');
const newGalleryTitle1 = document.querySelector('.p-main__images__row__item__gallery__text__1');
const newGalleryTitle2 = document.querySelector('.p-main__images__row__item__gallery__text__2');
let pictureNumberToLocal;

//Modal
const imageModal = document.querySelector('.p-modal');
const openModalImages = document.querySelectorAll('.open-modal');
const closeModal = document.querySelector('.p-modal__close');
const modalBg = document.querySelector('.p-modal__bg');
const srcModalImage = document.querySelector('.p-modal__image');

//Carousel
const carouselTitle1 = document.querySelector('.p-main__carosuel__title_1');
const carouselTitle2 = document.querySelector('.p-main__carosuel__title_2');
const carouselTitle3 = document.querySelector('.p-main__carosuel__title_3');
const carouselImages = document.querySelectorAll('.p-main__carosuel__image');

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

  function loadGallery() {
      localStorage.setItem("category", this.parentNode.firstElementChild.innerHTML);

      fetch(`${window.location.origin}/api/pictures`)
      .then((resp) => resp.json())
      .then((data) => {
        pictureNumberToLocal = 0;
        data.forEach(item => {
          if(item.gallery.name == this.parentNode.firstElementChild.innerHTML) pictureNumberToLocal++;
        });
        localStorage.setItem("pictureNumber", pictureNumberToLocal);
        window.open("../Gallery/categories/" , "_self");
      })
      .catch((err) => {
          console.log('Error:', err);
      });
  }

 function getGalleries() {
  fetch(`${window.location.origin}/api/galleries`)
  .then((resp) => resp.json())
  .then((data) => {
      let listOfGalleries;
      if(data.length >= 2) listOfGalleries = [data[0].name, data[1].name];
      if(data.length === 1) listOfGalleries = [data[0].name, 'Galeria nie istnieje'];
      if(data.length < 1) listOfGalleries = ['Galeria nie istnieje', 'Galeria nie istnieje'];

      newGalleryTitle1.innerHTML = listOfGalleries[0];
      newGalleryTitle2.innerHTML = listOfGalleries[1];

      getPictures(listOfGalleries);

      galleriesButtons.forEach(item => item.addEventListener('click', loadGallery));
  })
  .catch((err) => {
      console.log(err);
  });
}
getGalleries();

function getPictures(galleryNames) {
  fetch(`${window.location.origin}/api/pictures`)
        .then((resp) => resp.json())
        .then((data) => {
          pictureNumberToLocal = 0;
          imgNumberOfGallery = data.forEach(item => {
            if(item.gallery.name == galleryNames) pictureNumberToLocal++;
          });
          for(let i = 0; i < 2; i++) {

            data.some(function(value, index, _arr) {
              if(galleryNames[i] === value.gallery.name) {
                newGalleryImages[i].src = `../uploads/${value.filename}`;
              }

              return galleryNames[i] === value.gallery.name;
            });
          }
        })
        .catch((err) => {
            console.log('Error:', err);
        });
}

function activeHover() {
  this.firstElementChild.style.opacity = '1';
  this.firstElementChild.style.width = '100%';
}

function disableHover() {
  this.firstElementChild.style.width = '0px';
  this.firstElementChild.style.opacity = '0';
}


openModalImages.forEach(image => image.addEventListener('click', openModal));
closeModal.addEventListener('click', () => {imageModal.style.display = 'none'; srcModalImage.style.transform = 'scale(0)';});
modalBg.addEventListener('click', () => {imageModal.style.display = 'none'; srcModalImage.style.transform = 'scale(0)';});
headerContentElement.forEach(element => element.addEventListener('mouseover', changeHeaderTheme));
window.addEventListener('scroll', debounce(stickyNavOnScroll));
window.addEventListener('load', () => {loading.style.opacity = '0';});
loading.addEventListener('transitionend', () => {loading.style.display = 'none'});
imagesButton.forEach(button => button.addEventListener('click', () => {window.open("Gallery/" , "_self");}));
aboutMeButton.addEventListener('click', () => {window.open("about_me/" , "_self");});
newGalleryContainer.forEach(item => item.addEventListener('mouseover', activeHover));
newGalleryContainer.forEach(item => item.addEventListener('mouseout', disableHover));