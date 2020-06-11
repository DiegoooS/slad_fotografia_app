
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    picturesAmount: {
        type: Number,
    }
});

const Gallery = mongoose.model('gallery', gallerySchema);

function  validateGallery(gallery) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(true)
    });

    return schema.validate(gallery);
}

module.exports.Gallery = Gallery;
module.exports.validate = validateGallery;