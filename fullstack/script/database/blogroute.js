const express = require('express');
const router = express.Router();
const _Blog = require('./models/blog');

router.post('/', async (req, res) => {
    const temp = new _Blog({
        title: req.body.title,
        tags: req.body.tags,
        category: req.body.category,
        content: req.body.content,
        author: req.body.author
    });
    try {
        const savedPost = await temp.save();
        res.json({ result: savedPost })
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "cannot add the data" });
    }
});

router.get('/', async (req, res) => {
    try {
        var blogs = await _Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(404).json({ message: "cannot get the data" });
    }
});

router.get('/id/:id', async (req, res) => {
    try {
        var blogs = await _Blog.find({ _id: req.params.id });
        res.json(blogs);

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "cannot get the data" });
    }
});

module.exports = router;