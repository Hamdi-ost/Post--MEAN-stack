const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();
mongoose.connect("mongodb://localhost:27017/Posts")
    .then(() => {
        console.log('Connected to database !');
    })
    .catch(() => {
        console.log('Connection failed !');
    });

app.use(bodyParser.json()); // Parsing json data

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methodes', 'GET, POST, DELETE, PATCH, OPTIONS');

    next(); // To continue to the next middleware wich is /api/post (look down)
})

/******************** POSTS *****************/

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save();
    res.status(201).json({
        message: 'Post created !!'
    })
});

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'Post fetched succesfully!',
                posts: documents
            })
        });

});

module.exports = app;
