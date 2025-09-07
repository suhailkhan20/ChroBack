const express = require('express');
const { sendEmail } = require('../controllers/contactController');
const router = express.Router();

router.post('/contact', sendEmail);

module.exports = router;