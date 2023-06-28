const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    profileImage: {
        type: String
    },
    username: {
        type: String,
    },
    date: {
        type: Number
    },
    comment: {
        type: String
    },
    replies: {
        type: Array
    },
    likes: {
        type: Array
    }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;