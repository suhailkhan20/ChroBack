// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'firstname lastname');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const searchPosts = async (req, res) => {
  const { query } = req.query;
  try {
    // 1. Find user IDs that match the search query
    const users = await User.find({
      $or: [
        { firstname: { $regex: query, $options: 'i' } },
        { lastname: { $regex: query, $options: 'i' } }
      ]
    });
    const userIds = users.map(user => user._id);

    // 2. Search posts by title, content, OR the found user IDs
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { author: { $in: userIds } } // <-- This allows searching by author
      ]
    }).populate('author', 'firstname lastname');

    res.json(posts);
  } catch (error) {
    console.error(error); // This will print the specific error in your terminal
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single post
// @route   GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'firstname lastname');
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get posts by logged-in user
// @route   GET /api/posts/my-posts
// @access  Private
const getPostsByAuthor = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).populate('author', 'firstname lastname');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const newPost = new Post({
      title,
      content,
      image,
      author: req.user._id,
    });
    const createdPost = await newPost.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(400).json({ message: 'Invalid post data' });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  const { title, content, image } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (post && post.author.toString() === req.user._id.toString()) {
      post.title = title || post.title;
      post.content = content || post.content;
      post.image = image || post.image;
      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post && post.author.toString() === req.user._id.toString()) {
      await Post.deleteOne({ _id: req.params.id });
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPosts, searchPosts, getPostById, getPostsByAuthor, createPost, updatePost, deletePost };