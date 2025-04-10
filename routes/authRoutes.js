const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authenticate} = require('../middleware/auth');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/current-user', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
