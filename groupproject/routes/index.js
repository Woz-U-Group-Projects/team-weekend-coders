const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator/check');

const router = express.Router();
const Registration = mongoose.model('Registration');

if (errors.isEmpty()) {
  const registration = new Registration(req.body);
  registration.save()
    .then(() => { res.send('Thank you for your registration!'); })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
} else {
    console.log('error')
}

router.get('/registrations', (req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});

router.get('/', (req, res) => {
    res.render('form', { title: 'Customer input form' });
  });

router.post('/', [
    body('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    body('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ] , (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      res.send('Thank you for your registration!');
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

module.exports = router;