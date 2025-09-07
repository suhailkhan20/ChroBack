// routes/postRoutes.js
const express = require('express');
const { getPosts, getPostById, searchPosts, getPostsByAuthor, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes (requires a valid token)
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.get('/my-posts', protect, getPostsByAuthor); // <-- Add this new route
router.get('/search', searchPosts)

module.exports = router;

