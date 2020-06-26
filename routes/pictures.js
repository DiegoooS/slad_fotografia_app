
const sharp = require('sharp');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const fs = require('fs');
const multer = require('multer');
const { Picture, validate } = require('../models/picture');
const { Gallery } = require('../models/gallery');
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

async function fileFilter (req, file, cb) {
    file.galleryId = req.body.galleryId;
    const { error } = validate(file);
    if(error) return cb(new Error(error.details[0].message));

    if(file.mimetype !== 'image/jpeg') return cb(new Error(`Wrong image type: ${file.mimetype}`));

    const gallery = await Gallery.findById(file.galleryId);
    if(!gallery) return cb(new Error('Gallery not found in database.'));

    cb(null, true);
  }
const upload = multer({ storage: storage, fileFilter: fileFilter }).array('photos');


router.get('/', async(req, res) => {
    const pictures = await Picture.find().sort('-date');

    res.send(pictures);
});

router.post('/', [auth, admin] , async(req, res) => {
    upload (req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send(err.message);
        } else if (err) {
            return res.status(400).send(err.message);
    }

    if(!req.files || req.files === 'undefined' || req.files.length === 0) return res.status(400).send('No picture sended.');

    const gallery = await Gallery.findById(req.body.galleryId);

    req.files.forEach(async function(pic) {
        sharp(pic.path)
        .resize({ width: 1024 })
        .toBuffer()
        .then( data => {
            fs.writeFileSync(pic.path, data);
        })
        .catch( err => {
            console.log(err);
        });
        {
            const picture = new Picture({
                originalname: pic.originalname,
                mimetype: pic.mimetype,
                size: pic.size,
                fieldname: pic.fieldname,
                encoding: pic.encoding,
                destination: pic.destination,
                filename: pic.filename,
                path: pic.path,
                gallery: {
                    _id: gallery._id,
                    name: gallery.name
                }
            });

            await picture.save();
        }
    });
    res.send(req.files);
    });
});

router.delete('/:id', [auth, admin], validateObjectId , async(req, res) => {
    const picture = await Picture.findById(req.params.id);  
    if(!picture) return res.status(404).send('Picture not found');
    fs.unlink(`public/uploads/${picture.filename}`, async(err) => {
        if (err) return res.status(404).send('File not found');

        await Picture.deleteOne({ _id: picture._id });
        res.send(picture);
      });
});

module.exports = router;