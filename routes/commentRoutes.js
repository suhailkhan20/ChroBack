// server/routes/commentRoutes.js
const express = require('express');
const { getCommentsByPostId, createComment, deleteComment } = require('../controllers/commentController');
// Correct the import statement to get the 'protect' function
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all comments for a post
router.get('/:postId', getCommentsByPostId);

// POST a new comment (requires authentication)
// Use the 'protect' function directly
router.post('/:postId', protect, createComment);

// DELETE a comment (requires authentication)
// Use the 'protect' function directly
router.delete('/:commentId', protect, deleteComment);

module.exports = router;