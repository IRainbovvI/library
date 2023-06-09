const middleware = require('../../middleware');
const Book = require('../../models/Book');
const User = require('../../models/User');
const express = require('express');
const router = express.Router();

const { checkSchema, validationResult } = require('express-validator');

// @route GET api/books
// @description Get all books
// @access Protected
router.get('/', middleware.decodeJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('books');

    return res.json(user.books);
  } catch (e) {
    return res
      .status(404)
      .json({ success: false, message: 'Books not found.' });
  }
});

// @route GET api/books/:id
// @description Get single book by id
// @access Protected
router.get(
  '/:id',
  middleware.decodeJWT,
  checkSchema({
    id: {
      isMongoId: {
        errorMessage: 'Invalid ID format.'
      },
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    }
  }),
  async (req, res) => {
    // Validating request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const bookId = req.params.id;
      const book = await Book.findById(bookId);

      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: 'Book not found.' });
      }

      return res.status(200).json({ success: true, book });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  }
);

// @route Post api/books
// @description add/save book
// @access Protected
router.post(
  '/',
  middleware.decodeJWT,
  checkSchema({
    title: {
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    author: {
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    imgSrc: {
      isURL: {
        errorMessage: 'Invalid URL format.'
      },
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    description: {
      optional: true
    },
    published_date: {
      optional: true,
      isDate: {
        errorMessage: 'Data is invalid.'
      }
    },
    publisher: {
      optional: true
    }
  }),
  async (req, res) => {
    // Validating request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const user = await User.findById(req.userId);
      const book = new Book(req.body);
      await book.save();
      user.books.push(book);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'New book was created.' });
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  }
);

// @route PUT api/books/:id
// @description Update book
// @access Protected
router.put(
  '/:id',
  middleware.decodeJWT,
  checkSchema({
    title: {
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    author: {
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    },
    imgSrc: {
      notEmpty: {
        errorMessage: 'This field is required.'
      },
      isURL: {
        errorMessage: 'Invalid URL format.'
      }
    },
    description: { optional: true },
    published_date: {
      optional: true,
      isDate: {
        errorMessage: 'Data is invalid.'
      }
    },
    publisher: { optional: true }
  }),
  async (req, res) => {
    // Validating request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors });
    }

    const bookId = req.params.id;

    try {
      const book = await Book.findById(bookId);

      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: 'Book not found.' });
      }

      Object.keys(req.body).map((key) => {
        book[key] = req.body[key];
      });

      await book.save();

      return res
        .status(200)
        .json({ success: true, message: 'Book updated successfully.' });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  }
);

// @route GET api/books/:id
// @description Delete book by id
// @access Protected
router.delete(
  '/:id',
  middleware.decodeJWT,
  checkSchema({
    id: {
      isMongoId: {
        errorMessage: 'Invalid ID format.'
      },
      notEmpty: {
        errorMessage: 'This field is required.'
      }
    }
  }),
  async (req, res) => {
    // Validating request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors });
    }

    try {
      const book = await Book.findByIdAndRemove(req.params.id);
      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: 'Book not found.' });
      }
      const user = await User.findById(req.userId);
      user.books.pull(req.params.id);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: 'Book was deleted.' });
    } catch (e) {
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
  }
);

module.exports = router;
