// server/controllers/commentController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get all comments for a specific post
const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'firstname lastname')
            .sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments.' });
    }
};

// Create a new comment
const createComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.postId;
    const authorId = req.user.id; // From the auth middleware

    try {
        const newComment = new Comment({
            content,
            author: authorId,
            post: postId,
        });

        const savedComment = await newComment.save();
        
        // Add the comment reference to the Post document
        await Post.findByIdAndUpdate(postId, {
            $push: { comments: savedComment._id }
        });

        // Populate the author for the response
        const populatedComment = await Comment.findById(savedComment._id)
            .populate('author', 'firstname lastname');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment.' });
    }
};

// Add a delete comment function (optional but recommended)
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        
        // Check if the user is the author of the comment
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
        }
        
        // Remove the comment from the Post's comments array
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id }
        });

        // Delete the comment document
        await Comment.findByIdAndDelete(req.params.commentId);

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment.' });
    }
};

module.exports = {
    getCommentsByPostId,
    createComment,
    deleteComment 
};