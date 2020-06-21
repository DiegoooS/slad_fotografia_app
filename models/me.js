const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const meSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        min: 10,
        max: 15000
    }
});

const Me = mongoose.model('me', meSchema);

function  validateMe(me) {
    const schema = Joi.object({
        text: Joi.string().min(10).max(15000).required(true)
    });

    return schema.validate(me);
}

module.exports.Me = Me;
module.exports.validate = validateMe;