const express = require('express');
const router = express.Router();

const {
    getPost,
    deletePost,
    editPost,
    getPosts,
    addPost
} = require('../controllers/api-post-controller');

// Get All Posts
router.get('/api/posts', getPosts);
// Add New Post
router.post('/api/add-post', addPost);
// Get Post by ID
router.get('/api/posts/:id', getPost);
//Delete Post by ID
router.delete('/api/posts/:id', deletePost);
// Update Post by ID
router.put('/api/post/:id', editPost);

module.exports = router;