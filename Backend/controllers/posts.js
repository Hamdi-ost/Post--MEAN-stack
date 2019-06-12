const Post = require('../models/post');

/* -------------------------------------------------- */
exports.createPost = (req, res, next) => { // image == attribu in body req
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
    })
        .catch(error => {
            res.status(500).json({
                message: 'Creating a post failed!'
            });
        });
}

/* -------------------------------------------------- */
exports.updatePost = (req, res, next) => {
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
            if (result.n > 0) {
                res.status(200).json({ message: 'Updated successeful!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Couldn\'t update post!'
            });
        });
}

/* -------------------------------------------------- */
exports.getAllPosts = (req, res, next) => {
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
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
}

/* -------------------------------------------------- */
exports.getPostById = (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Page not Found !!', })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed!'
            });
        });
}

/* -------------------------------------------------- */
exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Post Deleted!' });
            } else {
                res.status(401).json({ message: 'Not authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Deleting posts failed!'
            });
        });
}
