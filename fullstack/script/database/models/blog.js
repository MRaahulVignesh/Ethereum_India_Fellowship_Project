const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const Post = mongoose.model('posts', PostSchema);
module.exports = Post;