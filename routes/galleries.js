
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const fs = require('fs');
const validateObjectId = require('../middleware/validateObjectId');
const cors = require('cors');
const { Gallery, validate } = require('../models/gallery');
const { Picture } = require('../models/picture');
const express = require('express');
const router = express.Router();

router.get('/', cors() ,async(req, res) => {
    const galleries = await Gallery.find().sort('-dateOut');

    res.send(galleries);
});

router.get('/:id', validateObjectId, async(req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if(!gallery) return res.status(404).send('Gallery with the given Id was not found in database');

    res.send(gallery);
});

router.post('/',[auth, admin], async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const galleries = await Gallery.find();

    let repetition = false;
    galleries.forEach(item => {
        if(req.body.name === item.name) repetition = true;
    });
    if(repetition) return res.status(400).send('Gallery name already taken.');

    const gallery = new Gallery({
        name: req.body.name
    });

    gallery.save();

    res.send(gallery);
});

router.put('/:id', [auth, admin], validateObjectId, async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const gallery = await Gallery.findByIdAndUpdate(req.params.id, {
        $set: { name: req.body.name }
    },{ new:true });

    if(!gallery) return res.status(404).send('Gallery with the given Id was not found in database.');

    res.send(gallery);
});

router.delete('/:id', [auth, admin] , validateObjectId , async(req, res) => {
    const gallery = await Gallery.findById(req.params.id);
    if(!gallery) return res.status(404).send('Gallery with the given Id was not found in database');

    const pictures = await Picture.find();

    pictures.forEach(pic => {
        if(pic.gallery.name === gallery.name) {
            fs.unlink(`public/uploads/${pic.filename}`, async(err) => {
                if (err) return res.status(404).send('File not found');

                await Picture.deleteOne({ _id: pic._id });
            });
        }
    });

    await Gallery.deleteOne({ _id: gallery._id });

    res.send(gallery);
});

module.exports = router;