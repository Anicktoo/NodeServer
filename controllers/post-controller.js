const Post = require('../models/post');
const createPath = require('../helpers/create-path');
const { handleError } = require('../helpers/handle-error');


const getPost = (req, res) => {
    const title = 'Post';
    Post
        .findById(req.params.id)
        .then((post) => {
            if (!post) {
                throw new Error('Post not found');
            }
            res.render(createPath('post'), { title, post });
        })
        .catch((error) => {
            handleError(res, error)
            res.render(createPath('error'), { title: 'Error' });
        });
};

const deletePost = (req, res) => {
    Post
        .findByIdAndDelete(req.params.id)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => handleError(res, error));
};

const getEditPost = (req, res) => {
    const title = 'Edit Post';
    Post
        .findById(req.params.id)
        .then((post) => {
            if (!post) {
                throw new Error('Post not found');
            }
            res.render(createPath('edit-post'), { title, post });
        })
        .catch((error) => handleError(res, error));
};

const editPost = (req, res) => {
    const { title, author, text } = req.body;
    const { id } = req.params;
    Post
        .findByIdAndUpdate(id, { title, author, text })
        .then((result) => {
            if (!result) {
                throw new Error('Post not found');
            }
            res
                .status(301)
                .redirect(`/posts/${id}`);
        })
        .catch((error) => handleError(res, error));
};

const getPosts = (req, res) => {
    const title = 'Posts';
    Post
        .find()
        .sort({ createdAt: -1 })
        .then((posts) => {
            res.render(createPath('posts'), { title, posts });
        })
        .catch((error) => handleError(res, error));
};

const getAddPost = (req, res) => {
    const title = 'Add post';
    res.render(createPath('add-post'), { title });
};

const addPost = (req, res) => {
    const { title, author, text } = req.body;
    const post = new Post({ title, author, text });
    post
        .save()
        .then((result) => {
            res
                .status(301)
                .redirect(`/posts`);
        })
        .catch((error) => handleError(res, error));
};

module.exports = {
    getPost,
    deletePost,
    getEditPost,
    editPost,
    getPosts,
    getAddPost,
    addPost
};