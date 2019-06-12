const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};
// Config multer (file upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invilid mime type');
        if (isValid) {
            error = null;
        }
        cb(null, 'Backend/images'); // the path relative to server.js
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});
/******************** POSTS *****************/

router.post('',
    checkAuth, // to check the token
    multer({ storage: storage }).single("image"), (req, res, next) => { // image == attribu in body req
        const url = req.protocol + '://' + req.get('host'); //url from front
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename,
            creator: req.userData.userId
        });
        post.save().then(createdPost => {
            res.status(201).json({
                message: 'Post Created !!',
                post: {
                    ...createdPost, // a copy of createdPost
                    id: createdPost._id
                }
            });
        });
    });

router.put('/:id',
    checkAuth,
    multer({ storage: storage }).single("image"), (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get('host'); //url from front
            imagePath = url + '/images/' + req.file.filename
        }
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        });
        Post.updateOne({ _id: req.params.id, creator: req.userData.userId /* only the creator update his post */ }, post)
            .then(result => {
                if (result.nModified > 0) {
                    res.status(200).json({ message: 'Updated successeful!' });
                } else {
                    res.status(401).json({ message: 'Not authorized!' });
                }
            })
    });

router.get('', (req, res, next) => {
    const pagesize = +req.query.pagesize; //pagination ('+' convert it to number)
    const currentPage = +req.query.page; //pagination
    const postQuery = Post.find();
    let fetchedPosts;

    if (pagesize && currentPage) {
        postQuery
            .skip(pagesize * (currentPage - 1))
            .limit(pagesize); // return only pagesize document
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents; // So I can use it in the second .then
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Post fetched succesfully!',
                posts: fetchedPosts,
                maxPosts: count
            })
        });
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Page not Found !!', })
            }
        });
});

router.delete('/:id',
    checkAuth,
    (req, res, next) => {
        Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
            .then(result => {
                if (result.n > 0) {
                    res.status(200).json({ message: 'Post Deleted!' });
                } else {
                    res.status(401).json({ message: 'Not authorized!' });
                }
            })
    });

module.exports = router;
