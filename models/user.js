
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const { func } = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 30,
        required: true
    },
    email: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));

    return token;
};

const User = new mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;