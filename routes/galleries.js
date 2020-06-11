
const { Gallery, validate } = require('../models/gallery');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const gallery = new Gallery({
        name: req.body.name
    });

    gallery.save();

    res.send(gallery);
});

module.exports = router;