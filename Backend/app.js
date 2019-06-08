const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb://localhost:27017/Posts", { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database !');
    })
    .catch(() => {
        console.log('Connection failed !');
    });

app.use(bodyParser.json()); // Parsing json data
app.use("/images", express.static(path.join('Backend/images'))); // let any request target /images and forword to Backend/images

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next(); // To continue to the next middleware wich is /api/post (look down)
});


app.use('/api/posts', postsRoutes);
app.use('/api/user', usersRoutes);


module.exports = app;
