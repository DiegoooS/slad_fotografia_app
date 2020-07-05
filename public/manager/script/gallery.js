
const galleryError = document.querySelector('.gallery__error');
const gallery = document.querySelector('.gallery');
const galleryInput = document.querySelector('.gallery_name');
const submitGallery = document.querySelector('.submitGallery');
const selectedGallery = document.querySelector('.selectedGallery');
const galleryId = document.querySelector('.galleryId');
const pictureMenu = document.querySelector('.pictureMenu');
const deleteMarked = document.querySelector('.deleteMarked');
let galleries;
let galleriesList;
const galleryPhotos = document.querySelector('.photos');
const pictureUpload = document.querySelector('.picture-upload');
const logoutButton = document.querySelector('.logout_button');
const fileUploadErrorContainer = document.querySelector('.file-upload-error');

//Files input in form
const customFileInput = document.querySelector('.custom-file-input');
const customFileLabel = document.querySelector('.custom-file-label');

function createNode(element) {
return document.createElement(element);
}

function append(parent, element) {
return parent.appendChild(element);
}

function getGalleries() {
    checkIfLogged();
    fetch(`${window.location.origin}/api/galleries`)
    .then((resp) => resp.json())
    .then((data) => {
        galleriesList = data;
        data.forEach(newGallery => {
            const li = createNode('li');
            const button = createNode('button')
            const p = createNode('p');
            p.innerHTML = newGallery.name;
            li.classList.add('galleryItem', 'list-group-item', 'list-group-item-action', 'd-flex', 'justify-content-between');
            li.addEventListener('click', getPictures);
            button.classList.add('removeGalleryButton', 'btn', 'btn-danger');
            button.innerHTML = 'Usuń';
            button.addEventListener('click', () => {removeGallery(newGallery._id)});
            append(li, p);
            append(li, button);
            append(gallery, li);
        })
    })
    .catch((err) => {
        console.log(err);
    });
}

async function postGallery() {
    checkIfLogged();
    const url = `${window.location.origin}/api/galleries`;

    const fetchData = {
        method: 'POST',
        body: JSON.stringify({ name: galleryInput.value }),
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': `${localStorage.getItem('x-auth-token')}`
        }
    };

    await fetch(url, fetchData)
    .then((data) => data.text())
    .then((data) => {
        if(!IsJsonString(data)) galleryError.innerHTML = data;
        else window.location.reload(true);
    })
    .catch((err) => {
        console.log(err);
    });
}

async function removeGallery(id) {
    checkIfLogged();
    const url = `${window.location.origin}/api/galleries/${id}`;

    const fetchData = {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': `${localStorage.getItem('x-auth-token')}`
            }
        }

        await fetch(url, fetchData)
        .then((data) => {
        })
        .catch((err) => {
            console.log(err);
        });
    window.location.reload(true);
}

async function getPictures() {
    checkIfLogged();
    pictureMenu.style.display = 'block';
    galleryPhotos.innerHTML = '';
    //Set Id of gallery what is need to send an request to post images
    galleriesList.forEach(item => {
        if(item.name === this.firstChild.innerHTML) galleryId.value = item._id;
    });

    //Add Active class
    galleries = document.querySelectorAll('.galleryItem');
    galleries.forEach(gall => {
        if(gall.classList.contains('active')) gall.classList.remove('active');
    });
    this.classList.add('active');
    selectedGallery.innerHTML = this.firstChild.innerHTML;

    fetch(`${window.location.origin}/api/pictures`)
        .then((resp) => resp.json())
        .then((data) => {
            data.forEach(picture => {
                if(this.firstChild.innerHTML === picture.gallery.name) {
                    const img = createNode('img');
                    img.src = `../../uploads/${picture.filename}`;
                    img.classList.add('centered-and-cropped');
                    img.addEventListener('click', markPicture);
                    img.id = picture._id;

                    const div = createNode('div');
                    div.classList.add('photos__picture__container', 'p-1');

                    append(div, img)
                    append(galleryPhotos, div);
                }
            })
        })
        .catch((err) => {
            console.log('Error:', err);
        });
}

async function sendPictures() {
    checkIfLogged();
    const files = this.files;
    const formData = new FormData();

    formData.append('galleryId', galleryId.value);
    for (let i = 0 ; i < files.length ; i++ )  {
        formData.append('photos', files[i]);
    }

    const url = `${window.location.origin}/api/pictures`;

    const fetchData = {
        method: 'POST',
        body: formData,
        headers: {
        'x-auth-token': `${localStorage.getItem('x-auth-token')}`
        }
    };

    fetch(`${window.location.origin}/api/pictures`, fetchData)
      .then(response => {
        let status = response.status;
        response.text()
            .then(data => {
                if(status != 200) fileUploadErrorContainer.innerHTML = data;
                else window.location.reload(true);
            })
            .catch(error => {
                console.error(error);
            });
      });
}

async function removePicture(id) {
    checkIfLogged();
    const url = `${window.location.origin}/api/pictures/${id}`;

    const fetchData = {
            method: 'DELETE',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': `${localStorage.getItem('x-auth-token')}`
            }
        }

        await fetch(url, fetchData)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err)
        });
}

function markPicture() {
    checkIfLogged();
    if (this.classList.contains('marked')) {
        this.classList.remove('marked');
    }
    else {
        this.classList.add('marked');
    }
}

function deleteMarkedPictures() {
    checkIfLogged();
    const pics = document.querySelectorAll('.marked');
    pics.forEach(item => {
    removePicture(item.id);
    });
    window.location.reload(true);
}

function getFileNameForForm() {
    customFileLabel.innerHTML = `Wybrana liczba zdjęć: ${this.files.length}`;
}

function checkIfLogged() {
    if(!localStorage.getItem("x-auth-token")) logout();
}

function logout() {
    localStorage.clear();
    window.location.replace(`${window.location.origin}/manager`);
}

function IsJsonString(str) {
try {
    JSON.parse(str);
} catch (e) {
    return false;
}
return true;
}

window.addEventListener('load', getGalleries);
submitGallery.addEventListener('click', postGallery);
deleteMarked.addEventListener('click', deleteMarkedPictures);
customFileInput.addEventListener('change', getFileNameForForm);
logoutButton.addEventListener('click', logout);
pictureUpload.addEventListener('change', sendPictures);