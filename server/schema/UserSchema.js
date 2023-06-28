const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    profileImage: {
        type: String
    },
    fullname: {
        type: String
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    dateJoined: {
        type: Number
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
