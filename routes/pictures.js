
const multer = require('multer');
const { Picture, validate } = require('../models/picture');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

//It Should save an image and return his name, category and directory

router.post('/', upload.array('photos') , async(req, res) => {
    req.files.forEach(pic => {
        let{ error } = validate(pic);
        if(error) return res.status(400).send(error.details[0].message);
    });

    req.files.forEach(async function(pic) {
        {
            const picture = new Picture({
                originalname: pic.originalname,
                mimetype: pic.mimetype,
                size: pic.size,
                fieldname: pic.fieldname,
                encoding: pic.encoding,
                destination: pic.destination,
                filename: pic.filename,
                path: pic.path
            });

            await picture.save();
        }
    });


    res.send(req.files);
});

module.exports = router;