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
                 const url = `${window.location.origin}/api/galleries`;

                 const fetchData = {
                     method: 'POST',
                     body: JSON.stringify({ name: galleryInput.value }),
                     headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                     }
                 }

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
                const url = `${window.location.origin}/api/galleries/${id}`;

                const fetchData = {
                     method: 'DELETE',
                     headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
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
                pictureMenu.style.display = 'block';
                galleryPhotos.innerHTML = '';
                //Set Id of gallery what is need to send an request to post images
                galleriesList.forEach(item => {
                    if(item.name === this.firstChild.innerHTML) galleryId.value = item._id;
                })

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
                                img.src = `../uploads/${picture.filename}`;
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

             async function removePicture(id) {
                const url = `${window.location.origin}/api/pictures/${id}`;

                const fetchData = {
                     method: 'DELETE',
                     headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
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
                if (this.classList.contains('marked')) {
                    this.classList.remove('marked');
                }
                else {
                    this.classList.add('marked');
                }
             }

             function deleteMarkedPictures() {
                 const pics = document.querySelectorAll('.marked');
                 pics.forEach(item => {
                    removePicture(item.id);
                 });
                 window.location.reload(true);
             }

             function getFileNameForForm() {
                customFileLabel.innerHTML = `Wybrana liczba zdjęć: ${this.files.length}`;
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