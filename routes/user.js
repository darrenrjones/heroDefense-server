'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');

const createAuthToken = require('../helper/createAuthToken');
const checkError = require('../helper/checkErrors');
const missingFields = require('../helper/missingFields');
const nonStringField = require('../helper/nonStringFields');
const trimmedFields = require('../helper/trimmedFields');
const tooBigOrTooSmall = require('../helper/tooBigOrTooSmall');

router.post('/register', (req, res, next) => {
  
  //checks for any missing fields
  missingFields(['username', 'password'], req);

  //checks to see if username and pass are not strings
  nonStringField(req);

  //removes white space
  trimmedFields(['username', 'password'],req);

  //checks username and password character lengths
  tooBigOrTooSmall(req);

  // Create new user in DB
  let {username, password} = req.body;  
  
  return User.hashPassword(password)
    .then(digest => {      
      const newUser = {
        username,
        password: digest,
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201)
        .location(`/api/users/${result.id}`)
        .json(result);
    })
    .catch(err => {
      let checkErrorAnswer = checkError(err);
      next(checkErrorAnswer);
    });
});

module.exports = router;
