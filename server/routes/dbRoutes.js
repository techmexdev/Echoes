var express = require('express');
var router = express.Router();
var path = require('path');
var util = require('../utilities.js');
var knex = require('../../db/db.js');

// queries database and returns user's album entries
router.get('/', function (req, res) {
  // get username from the cookie
  var username = req.cookies.username;
  // find all listen instances by the user
  knex.from('users')
      .join('album_impression', 'users.id', 'album_impression.user_id')
      .where('users.username', username)
      .join('album', 'album_impression.album_id', 'album.id')
      .join('artist', 'artist.id', 'album.artist_id')
      .join('listen_date', 'listen_date.album_impression_id', 'album_impression.id')
      .select('users.user',
              'listen_date.date',
              'album.title', 'artist.name', 'album.genre', 'album.year',
              'album_impression.rating', 'album_impression.impression', 'album_impression.id',
              'album.art_url60', 'album.art_url100')
      .orderBy('listen_date.date', 'desc')
      .then(function (result) {
        // send the result back to the user
        console.log(result);
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log('Problem grabbing user info');
      })
});

// post new album to the database
router.post('/', function (req, res) {
  var album = req.body.album;
  // put date into correct format for db
  var date = req.body.date.slice(0, 10);
  var username = req.cookies.username;
  // check if artist is in db
  knex('artist')
    .where({name : album.artistName})
    .select('id')
    .then(function(artistId) {
      if (artistId.length) {
      var artistId = artistId[0].id;
      // check if the album is already in the database
        knex('album')
          .select('id')
          .where('title', album.collectionName)
          .where('artist_id', artistId)
          .then(function(albumId) {
            // if the album exists
            if (albumId.length) {
              var albumId = albumId[0].id;
              // check if the user has listened to it before
              knex('users').select('id')
                .where('username', username)
                .then(function (userId) {
                  var userId = userId[0].id;
                  knex('album_impression').select('id')
                  .where('user_id', userId)
                  .where('album_id', albumId)
                  .then(function(impressId) {
                    // if user has listened to album
                    if (impressId.length) {
                      var impressId = impressId[0].id;
                      // Add a new listen date
                      knex('listen_date').select('id')
                        .where('album_impression_id', impressId)
                        .where('date', date)
                        .then( function (listenId) {
                          if (listenId.length) {
                            res.status(400).send('You already listened to this album that day.');
                          } else {
                            knex('listen_date').insert({
                              date: date,
                              album_impression_id: impressId
                            }).then(function() {
                              res.status(201).send('Successful PostA!');
                            })
                            .catch(function (err) {
                              console.log('Problem with inserting listen_date #1');
                              throw err;
                            });
                          }
                        })
                        .catch(function (err) {
                          console.log('Problem with grabbing listenDateId #1');
                          throw err;
                        });
                      //if user has not listened to album
                    } else {
                      //add an album_impression for the user
                      knex('album_impression').returning('id')
                      .insert({
                        user_id: userId,
                        album_id: albumId
                      }).then(function(impressId) {
                        var impressId = impressId[0].id;
                        // add new listen date for album
                        knex('listen_date').insert({
                          'date': date,
                          'album_impression_id': impressId
                        }).then(function() {
                          res.status(201).send('Successful PostB!');
                        })
                        .catch(function (err) {
                          console.log('Problem with inserting listen_date #2');
                          throw err;
                        });
                      })
                      .catch(function (err) {
                        console.log('Problem with inserting album_impression #1');
                        throw err;
                      });
                  }
                })
                .catch(function (err) {
                  console.log('Problem with grabbing album_impression_id #1');
                  throw err;
                });
              })
              .catch(function (err) {
                console.log('Problem with grabbing albumId');
              });
            // if album does not exist
            } else {
              // insert album
              knex('album').returning('id')
                .insert({
                  title: album.collectionName,
                  artist_id: artistId,
                  genre: album.primaryGenreName,
                  year: album.releaseDate.slice(0,4),
                  art_url60: album.artworkUrl60,
                  art_url100: album.artworkUrl100
                 }).then(function(albumId) {
                  var albumId = albumId[0];
                  // find user's id
                  knex.from('users')
                    .select('id')
                    .where('username', username)
                    .then(function(userId) {
                      var userId = userId[0].id;
                      // add album impression from user
                      knex('album_impression').returning('id')
                        .insert({
                          user_id: userId,
                          album_id: albumId
                        }).then(function(impressId) {
                          var impressId = impressId[0];
                          // add new listen date for album
                          knex('listen_date').insert({
                            'date': date,
                            'album_impression_id': impressId})
                          .then(function() {
                            res.status(201).send('Successful PostC!');
                          })
                          .catch(function (err) {
                            console.log('Problem with inserting listen_date #3');
                            throw err;
                          });
                        })
                        .catch(function (err) {
                          console.log('Problem with inserting album_impression #2');
                          throw err;
                        });
                    })
                    .catch(function (err) {
                      console.log('Problem with grabbing userId #2');
                      throw err;
                    });
                })
                .catch(function (err) {
                  console.log('Problem with inserting album #1');
                  throw err;
                });
            }
          })
          .catch(function (err) {
            console.log('Problem with grabbing albumId #1');
            throw err;
          });
      } else {
      // add artist to db
      knex('artist').returning('id')
        .insert({name: album.artistName})
        .then(function(artistId) {
          var artistId = artistId[0];
          console.log('artistId', artistId);
          // add album to db
          knex('album').returning('id')
          .insert({
            title: album.collectionName,
            artist_id: artistId,
            genre: album.primaryGenreName,
            year: album.releaseDate.slice(0,4),
            art_url60: album.artworkUrl60,
            art_url100: album.artworkUrl100
           }).then(function(albumId) {
            var albumId = albumId[0];
            // find user's id
            knex.from('users')
              .select('id')
              .where('username', username)
              .then(function(userId) {
                var userId = userId[0].id;
                // add album impression from user
                knex('album_impression').returning('id')
                  .insert({
                    user_id: userId,
                    album_id: albumId
                  }).then(function(impressId) {
                    var impressId = impressId[0];
                    // add new listen date for album
                    knex('listen_date').insert({'date': date,
                      'album_impression_id': impressId})
                      .then(function() {
                        res.status(201).send('Successful PostD!');
                      })
                      .catch(function (err) {
                        console.log('Problem with inserting listen_date #4');
                        throw err;
                      });
                  })
                  .catch(function (err) {
                    console.log('Problem with inserting album_impression #3');
                    throw err;
                  });
              })
              .catch(function (err) {
                console.log('Problem with selecting userId #3');
                throw err;
              });
          })
          .catch(function (err) {
            console.log('Problem with inserting album #2');
            throw err;
          });
        })
        .catch(function (err) {
          console.log('Problem with inserting artist #1');
          throw err;
        });;
      }
    })
    .catch(function (err) {
      console.log('Problem with grabbing artistId #1');
      throw err;
    });
});

// add/update impression
router.post('/update', function (req, res) {
  var impress = req.body;
  var id = Number(impress.id);
  var rating = Number(impress.rating);
  var impression = impress.impression;
  console.log('impress', impress);

  // if impression exists and rating doesn't
  if (impression && !rating) {
    knex('album_impression')
    .where('id', impress.id)
    //update impression w/ req.body
    .update({
      impression:impression,
    }).then(function () {
      res.status(201).end();
    })
  // if rating exists and impression doesn't
  } else if (rating && !impression) {
    knex('album_impression')
    .where('id', impress.id)
    //update rating w/ req.body
    .update({
      rating: rating
    }).then(function () {
      res.status(201).end();
    })
  // if rating and impression exist
  } else if (rating && impression) {
    knex('album_impression')
    .where('id', impress.id)
    //update impression and rating w/ req.body
    .update({
      impression:impress.impression,
      rating: impress.rating
    }).then(function () {
      res.status(201).end();
    })
  // if the user sent a blank save
  } else {
    // do nothing
    res.end();
  }
});

// remove listen_date
router.post('/delete', function (req, res) {
  var listenEntry = req.body;
  //find the listen_date Entry
  knex('listen_date')
    // check if there is more than 1 date for that impression_id
    .where('album_impression_id', listenEntry.impressionId)
    .then(function (dates) {
      if (dates.length > 1) {
        // delete listen_date entry
        knex('listen_date')
        .where('album_impression_id', listenEntry.impressionId)
        .where('date', listenEntry.date)
        .del()
        .then(function () {
          res.status(201).send('Successfully removed album');
        });
        // if album_impress_id = 1
      } else {
        // delete album_impression
        knex('listen_date')
        .where('album_impression_id', listenEntry.impressionId)
        .where('date', listenEntry.date)
        .del()
        .then(function () {
          knex('album_impression')
          .where('id', listenEntry.impressionId)
          .del()
          .then(function () {
            res.status(201).send('Successfully removed album');
          });
        });
      }
    });
});

module.exports = router;
