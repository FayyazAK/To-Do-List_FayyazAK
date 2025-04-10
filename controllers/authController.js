const User = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('../config/auth');
const { validateEmail, validatePassword, hashPassword, sanitizeUser } = require('../utils/userUtils');
const { generateToken } = require('../services/jwtService');
const HTTP_STATUS = require('../utils/statusCodes');

// Register a new user
const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Validate required fields
    if (!firstName || !username || !email || !password) {
      return res.error('First name, username, email and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.error('Invalid email format', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.error('Password must be at least 8 characters long', HTTP_STATUS.BAD_REQUEST);
    }

    // Check for existing username
    const existingUsername = await User.findByUsername(username.toLowerCase());
    if (existingUsername) {
      return res.error('Username is already taken', HTTP_STATUS.CONFLICT);
    }

    // Check for existing email
    const existingEmail = await User.findByEmail(email.toLowerCase());
    if (existingEmail) {
      return res.error('Email is already registered', HTTP_STATUS.CONFLICT);
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const userId = await User.create({
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const newUser = await User.findById(userId);
    
    // Generate JWT token
    const token = generateToken(newUser.user_id, newUser.role);

    // Set cookie
    res.cookie('token', token, config.cookieOptions);

    res.success({
      message: 'Registration successful',
      user: sanitizeUser(newUser)
    }, HTTP_STATUS.CREATED);

  } catch (error) { 
    next(error);
}   
};

// Login user
const login = async (req, res) => {
  try {

    if(!req.body){
      return res.error('No data provided!', HTTP_STATUS.BAD_REQUEST);
    }
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.error('Email and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Find user by email
    const user = await User.findByEmail(email.toLowerCase());
    if (!user) {
      return res.error('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.error('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = generateToken(user.user_id, user.role);

   
    // Set cookie
    res.cookie('token', token, config.cookieOptions);

    res.success({
      message: 'Login successful',
      user: sanitizeUser(user)
    }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.error('User not found', HTTP_STATUS.NOT_FOUND);
    }

    res.success(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res) => {
  res.clearCookie('token');
  res.success({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
}; 