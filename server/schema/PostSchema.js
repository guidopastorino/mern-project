const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    profileImage: {
      type: String
    },
    fullname: {
      type: String
    },
    username: {
      type: String
    },
    date: {
      type: Number
    },
    description: {
      type: String
    },
    filesContent: {
      type: Array
    },
    likes: {
      type: Array
    },
    comments: {
      type: Array
    },
    views: {
      type: Array
    },
    saved: {
      type: Array
    }
  },
  { versionKey: '__v' }
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;