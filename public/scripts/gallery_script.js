const galleryCategory = document.querySelectorAll('.gallery-main__category');
const loading = document.querySelector('.p-loading');
const galleriesContainer = document.querySelector('.gallery-main__gallery');

function openGallery (galleryToLocal, pictureNumberToLocal) {
    localStorage.setItem("category", galleryToLocal);
    localStorage.setItem("pictureNumber", pictureNumberToLocal);
    window.open("../Gallery/categories/category.html" , "_self");
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, element) {
    return parent.appendChild(element);
}

async function getAllGalleries() {
    await fetch(`${window.location.origin}/api/galleries`)
        .then((resp) => resp.json())
        .then(async(data) => {
            //get Pictures
            const pics = await getPictures();

            //Select pictures of gallery
            data.forEach(gal => {
            let galleryPics = [];
            pics.forEach(item => {
                if(gal.name === item.gallery.name) galleryPics.push(item);
            });

            //create new node gallery
            const div_1 = createNode('div');
            div_1.classList.add('col-lg-6','gallery-main__category');
            div_1.addEventListener('click', () => {openGallery(gal.name, galleryPics.length);});

            const div_2 = createNode('div');
            div_2.classList.add('row', 'h-75', 'w-100', 'flex-nowrap');

            const div_3 = createNode('div');
            div_3.classList.add('col-8', 'h-100', 'w-100', 'p-0');
            const img_1 = createNode('img');
            img_1.classList.add('centered-and-cropped', 'p-1');
            img_1.src = galleryPics.length > 0 ? `../uploads/${galleryPics[0].filename}` : `../uploads/blank.png`;
            //img_1.src = `../uploads/${galleryPics[0].filename}`;
            append(div_3, img_1);

            const div_4 = createNode('div');
            div_4.classList.add('col-4', 'p-0');

            const div_5 = createNode('div');
            div_5.classList.add('d-flex', 'flex-column', 'h-100', 'w-100');

            const div_6 = createNode('div');
            div_6.classList.add('h-50', 'w-100');
            const img_2 = createNode('img');
            img_2.classList.add('centered-and-cropped', 'p-1');
            img_2.src = galleryPics.length > 1 ? `../uploads/${galleryPics[1].filename}` : `../uploads/blank.png`;
            append(div_6, img_2);

            const div_7 = createNode('div');
            div_7.classList.add('h-50', 'w-100');
            const img_3 = createNode('img');
            img_3.classList.add('centered-and-cropped', 'p-1');
            img_3.src = galleryPics.length > 2 ? `../uploads/${galleryPics[2].filename}` : `../uploads/blank.png`;
            append(div_7, img_3);

            const div_8 = createNode('div');
            div_8.classList.add('row', 'h-25', 'w-100', 'flex-column', 'pl-1', 'gallery-main__category__text');
            const p_1 = createNode('p');
            p_1.classList.add('mb-1');
            p_1.innerHTML = gal.name;
            const p_2 = createNode('p');
            p_2.classList.add('text-secondary');
            p_2.innerHTML = `Liczba zdjęć: ${galleryPics.length} <span class="mr-2 ml-2"><i class="fas fa-ellipsis-v"></i></span> Natalia Olejniczak`;
            append(div_8, p_1);
            append(div_8, p_2);


            append(div_5, div_6);
            append(div_5, div_7);
            append(div_4, div_5);
            append(div_2, div_3);
            append(div_2, div_4);
            append(div_1, div_2);
            append(div_1, div_8);
            append(galleriesContainer, div_1);
            });
            
        })
        .catch((err) => {
            console.log(err);
        });
}

async function getPictures() {
    let galleryPictures = [];

    await fetch(`${window.location.origin}/api/pictures`)
        .then((resp) => resp.json())
        .then((data) => {
            galleryPictures = data;
        })
        .catch((err) => {
            console.log(err);
        });

    return galleryPictures;
}

galleryCategory.forEach(category => category.addEventListener('click', openGallery));

window.addEventListener('load', getAllGalleries);
loading.addEventListener('transitionend', () => {loading.style.display = 'none'});
window.addEventListener('load', () => {loading.style.opacity = '0';});

