const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json()); // Parsing json data

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methodes', 'GET, POST, DELETE, PATCH, OPTIONS');

    next(); // To continue to the next middleware wich is /api/post (look down)
})

/******************** POSTS *****************/

app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post created !!'
    })
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: 'azeazrazr', title: 'post1', content: 'constent 1' },
        { id: 'dfvxvxvxc', title: 'post2', content: 'constent 2' },
        { id: '254153544', title: 'post3', content: 'constent 3' }

    ]
    res.status(200).json({
        message: 'Post fetched succesfully!',
        posts: posts
    })
});

module.exports = app;
