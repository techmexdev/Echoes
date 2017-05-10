var express = require('express');
var router = express.Router();
var path = require('path');
var knex = require('../../db/db.js');
var util = require('../utilities.js');

// get requests are served static sign in page
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/../../client/signin.html'));
});

// post requests check username and password and redirect
router.post('/', function (req, res) {
  // get username and password from request body
  var username = req.body.username;
  var password = req.body.password;
  // knex query to search database for user
  var query = knex('users').where('username', username);
  query.then(function(result) {
    //if user does not exist
    if (!result.length) {
      // respond with status
      res.status(401).redirect('/signin');
      // if user exists
    } else {
      // find their hashed password in the db
      var hash = knex('users').where('username', username).select('password');
      hash.then(function (hash) {
        //knex returns an array with hash object at index 0
        hash = hash[0].password;
         util.checkPassword(password, hash, function (err, result) {
           if (err) {
             throw err;
           } else {
             // if password is correct
             if (result) {
               // set cookies
               res.cookie('signedIn', true);
               res.cookie('username', username);
               // redirect to dashboard
               res.redirect('/');
               // if password is incorrect
             } else {
               // send error
               res.status(401).send();
             }
           }
         });
      })
      .catch(function (err) {
        console.log('Something went wrong comparing passwords!');
        throw err;
      });
    }
  });
});
module.exports = router;
