const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    username: String,
    title: String,
    content: String,
    category: {
        type: String,
        enum: ['Business', 'Tech', 'Lifestyle', 'Entertainment'],
    },
    date: {
        type: Date,
        default: Data.now(),
    },
    likes: Number,
    comment: [Object],
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};
