const validateObjectId = require('../middleware/validateObjectId');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { gallerySchema } = require('./gallery');
const joiObjectid = require('joi-objectid');

const pictureSchema = new mongoose.Schema({
    originalname: {
        type: String,
        minlength: 1,
        maxlength: 255,
        required: true
    },
    mimetype: {
        type: String,
        minlength: 1,
        maxlength: 50,
        required: true
    },
    size: {
        type: Number,
        min: 1,
        max: 5 * 1024 * 1024, //5 mb
        required: true
    },
    fieldname: {
        type: String,
        min: 1,
        max: 50,
        required: true
    },
    encoding: {
        type: String,
        min: 1,
        max: 50,
        required: true
    },
    destination: {
        type: String,
        min: 1,
        max: 255,
        required: true
    },
    filename: {
        type: String,
        min: 1,
        max: 255,
        required: true
    },
    path: {
        type: String,
        min: 1,
        max: 255,
        required: true
    },
    gallery : {
        type: gallerySchema,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const Picture = mongoose.model('picture', pictureSchema);

function  validatePicture(picture) {
    const schema = Joi.object({
        originalname: Joi.string().min(1).max(255),
        mimetype: Joi.string().min(1).max(50),
        size: Joi.number().min(1).max(5 * 1024 * 1024),
        fieldname: Joi.string().min(1).max(255),
        encoding: Joi.string().min(1).max(50),
        destination: Joi.string().min(1).max(255),
        filename: Joi.string().min(1).max(50),
        path: Joi.string().min(1).max(255),
        galleryId:  Joi.objectId().required()
    });

    return schema.validate(picture);
}

module.exports.Picture = Picture;
module.exports.validate = validatePicture;

