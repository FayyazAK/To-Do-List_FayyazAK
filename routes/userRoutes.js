const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// User routes for admin
router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticate, authorizeAdmin, userController.getUserById);
router.post('/', authenticate, authorizeAdmin, userController.createUser);
router.put('/:id', authenticate, authorizeAdmin, userController.updateUser);
router.delete('/:id', authenticate, authorizeAdmin, userController.deleteUser);

// User routes for user
router.put('/update-profile', authenticate, userController.updateProfile);

module.exports = router; 