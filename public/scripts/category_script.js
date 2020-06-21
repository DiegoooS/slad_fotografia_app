const galleryContainer = document.querySelector('.category-main__gallery');
const loading = document.querySelector('.p-loading');
const categoryTitle = document.querySelector('.category_title');
const pictureNumber = document.querySelector('.picture-number');
//Modal

let imageModal;
let openModalImages;
let closeModal;
let modalBg;
let srcModalImage;


function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
}

async function getPictures() {
    await fetch(`${window.location.origin}/api/pictures`)
    .then((resp) => resp.json())
    .then((data) => {
        if(!localStorage.getItem('category')) window.open("../Gallery/gallery.html" , "_self");

        //set title
        categoryTitle.innerHTML = localStorage.getItem('category');
        //set picture number
        pictureNumber.innerHTML = `Ilość zdjęć: ${localStorage.getItem('pictureNumber')}`;

        const column_1 = createNode('div');
        column_1.classList.add('col-md', 'd-flex', 'flex-column', 'category-main__gallery__column');

        const column_2 = createNode('div');
        column_2.classList.add('col-md', 'd-flex', 'flex-column', 'category-main__gallery__column');

        const column_3 = createNode('div');
        column_3.classList.add('col-md', 'd-flex', 'flex-column', 'category-main__gallery__column');

        let columnCounter = 1;
        data.forEach(item => {
            if(item.gallery.name === localStorage.getItem('category')) {
                if(columnCounter < 4) {
                    const div_1 = createNode('div')
                    div_1.classList.add('position-relative', 'w-100', 'category-main__gallery__column__element', 'open-modal');

                    const div_2 = createNode('div')
                    div_2.classList.add('position-absolute', 'image__hover', 'h-100', 'w-100', 'd-flex', 'flex-column', 'justify-content-end');
                    const p = createNode('p');
                    p.classList.add('px-2', 'text-truncate');
                    p.innerHTML = 'Natalia Olejniczak';
                    append(div_2, p);

                    const img = createNode('img');
                    img.classList.add('img-fluid');
                    img.src = `../../uploads/${item.filename}`;

                    append(div_1, div_2);
                    append(div_1, img);
                    if(columnCounter === 1) append(column_1 , div_1);
                    if(columnCounter === 2) append(column_2 , div_1);
                    if(columnCounter === 3) append(column_3 , div_1);
                    columnCounter++;

                    if(columnCounter === 4) columnCounter = 1;
                }
                else columnCounter = 1;
            }

        append(galleryContainer, column_1);
        append(galleryContainer, column_2);
        append(galleryContainer, column_3);
        });

        imageModal = document.querySelector('.p-modal');
        openModalImages = document.querySelectorAll('.open-modal');
        closeModal = document.querySelector('.p-modal__close');
        modalBg = document.querySelector('.p-modal__bg');
        srcModalImage = document.querySelector('.p-modal__image');

        openModalImages.forEach(image => image.addEventListener('click', openModal));
        closeModal.addEventListener('click', () => {imageModal.style.display = 'none'; srcModalImage.style.transform = 'scale(0)';});
        modalBg.addEventListener('click', () => {imageModal.style.display = 'none'; srcModalImage.style.transform = 'scale(0)';});
    })
    .catch((err) => {
        console.log(err);
    });
}
getPictures();

function openModal() {
    imageModal.style.display = 'flex';
    srcModalImage.src = this.childNodes[1].src;
    setTimeout(() => {srcModalImage.style.transform = 'scale(1)';}, 100);
 }


window.addEventListener('load', () => {loading.style.opacity = '0';});
loading.addEventListener('transitionend', () => {loading.style.display = 'none'});