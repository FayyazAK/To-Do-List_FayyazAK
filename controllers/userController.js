const User = require('../models/User');
const { validateEmail, validatePassword, hashPassword, sanitizeUser, sanitizeUsers } = require('../utils/userUtils');
const HTTP_STATUS = require('../utils/statusCodes');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.success(sanitizeUsers(users));
  } catch (error) {
    next(error);
  }
};

// Get single user (admin only)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.error('User ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.error('User not found', HTTP_STATUS.NOT_FOUND);
    }
    // Remove sensitive data
    res.success(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
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
    // Remove sensitive data
    res.success(sanitizeUser(newUser), 201);
  } catch (error) {
    next(error);
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, username, email, password } = req.body;

    if (!userId) {
      return res.error('User ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.error('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return res.error('Invalid email format', HTTP_STATUS.BAD_REQUEST);
    }

    // Validate password if provided
    if (password && !validatePassword(password)) {
      return res.error('Password must be at least 8 characters long', HTTP_STATUS.BAD_REQUEST);
    }

    // Check for duplicate username
    if (username && username.toLowerCase() !== existingUser.username) {
      const existingUsername = await User.findByUsername(username.toLowerCase());
      if (existingUsername) {
        return res.error('Username is already taken', HTTP_STATUS.CONFLICT);
      }
    }

    // Check for duplicate email
    if (email && email.toLowerCase() !== existingUser.email) {
      const existingEmail = await User.findByEmail(email.toLowerCase());
      if (existingEmail) {
        return res.error('Email is already registered', HTTP_STATUS.CONFLICT);
      }
    }

    // Prepare update data
    const updateData = {
      firstName: firstName || existingUser.first_name,
      lastName: lastName || existingUser.last_name,
      username: username ? username.toLowerCase() : existingUser.username,
      email: email ? email.toLowerCase() : existingUser.email,
      password: password ? await hashPassword(password) : existingUser.password
    };

    // Update user
    await User.update(userId, updateData);
    const updatedUser = await User.findById(userId);
    // Remove sensitive data
    res.success(sanitizeUser(updatedUser));
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.error('User ID is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.error('User not found', HTTP_STATUS.NOT_FOUND);
    }

    await User.delete(userId);
    res.success({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update profile (user only)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findById(userId); 
    if (!existingUser) {
      return res.error('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Create update data object with only the fields to change
    const updateData = {};
    
    // Validate and add fields only if they're provided
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    
    if (email !== undefined) {
      if (!validateEmail(email)) {
        return res.error('Invalid email format', HTTP_STATUS.BAD_REQUEST);
      }
      
      if (email.toLowerCase() !== existingUser.email) {
        const existingEmail = await User.findByEmail(email.toLowerCase());
        if (existingEmail) {
          return res.error('Email is already registered', HTTP_STATUS.CONFLICT);
        }
      }
      updateData.email = email.toLowerCase();
    }
    
    if (username !== undefined) {
      if (username.toLowerCase() !== existingUser.username) {
        const existingUsername = await User.findByUsername(username.toLowerCase());
        if (existingUsername) {
          return res.error('Username is already taken', HTTP_STATUS.CONFLICT);
        }
      }
      updateData.username = username.toLowerCase();
    }
    
    if (password !== undefined) {
      if (!validatePassword(password)) {
        return res.error('Password must be at least 8 characters long', HTTP_STATUS.BAD_REQUEST);
      }
      updateData.password = await hashPassword(password);
    }
    
    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await User.update(userId, updateData);
    }
    
    const updatedUser = await User.findById(userId);
    
    
    res.success(sanitizeUser(updatedUser));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile
}; 