const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const express = require('express');
const { checkSchema, validationResult } = require('express-validator');
const router = express.Router();

// @route POST api/users/login
// @description Log in as existing user
// @access Public
router.post(
  '/login',
  checkSchema({
    email: {
      isEmail: {
        errorMessage: 'Value is not a valid email address.'
      },
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    password: {
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    }
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors });
    }

    let { email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch {
      return res.status(500).json({ success: false, message: 'Server error.' });
    }
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User was not found.' });
    } else {
      const passwordCompare = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordCompare) {
        return res
          .status(403)
          .json({ success: false, message: 'Incorrect password.' });
      }
    }
    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch {
      return res.status(500).json({ success: false, message: `Server error.` });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: existingUser.id,
        email: existingUser.email,
        token: token
      }
    });
  }
);

// @route POST api/users/signup
// @description Create new user
// @access Public
router.post(
  '/signup',
  checkSchema({
    email: {
      isEmail: {
        errorMessage: 'Value should be a valid email address.'
      },
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    password: {
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password should be at least 8 characters long and contain symbols, numbers, lovercase, uppercase characters.'
      },
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    name: {
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    }
  }),
  async (req, res, next) => {
    // Validating request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors });
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch {
      return res.status(500).json({ success: false, message: `Server error.` });
    }
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with the same email already exists.'
      });
    }

    const newUser = User({
      name,
      email,
      password: await bcrypt.hash(password, 8)
    });

    try {
      await newUser.save();
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
    let token;
    try {
      token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch {
      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
    res.status(201).json({
      success: true,
      data: { userId: newUser.id, email: newUser.email, token: token }
    });
  }
);

module.exports = router;
