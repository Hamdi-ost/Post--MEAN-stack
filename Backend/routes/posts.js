const express = require('express');
const Post = require('../models/post');

const router = express.Router();

/******************** POSTS *****************/

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save();
    res.status(201).json({
        message: 'Post created !!'
    })
});

router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Post fetched succesfully!',
                posts: documents
            })
        });
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Post deleted!' });
        })
});

module.exports = router;
