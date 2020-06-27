const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const { Me, validate } = require('../models/me');

router.get('/', async(req, res) => {
    const me = await Me.find();

    return res.send(me);
});

router.post('/', [auth, isAdmin] ,async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const me = new Me({
        text: req.body.text
    });

    me.save();

    res.send(me);
});

router.put('/:id', [auth, isAdmin, validateObjectId] ,async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const me = await Me.findByIdAndUpdate(req.params.id, {
        $set: { text: req.body.text }
    },{ new: true });
    if(!me) return res.status(404).send('Text about me with the given Id was not found');

    res.send(me);
});

module.exports = router;