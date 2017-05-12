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
        console.log('---------> Problem grabbing user info');
      })
});


function insertIfNeeded(table, fields, keys, errMessage) {
  errMessage = errMessage || 'error inserting/retrieving from ' + table;
  //this returns a promise
  //populates with fields and queries with keys
  return knex(table).select('id').where(keys).then(function(id){
    if(id.length === 0) {
      return knex(table).insert(fields).returning('id');
    } else {
      return id;
    }
  })
  .catch(function(e){
    console.log(errMessage, e);
    throw e;
  });
}

//post new album to the database
router.post('/', function(req, res) {
  var album = req.body.album;
  var date = req.body.date.slice(0, 10);
  var username = req.cookies.username;

  console.log('------------>Username', username)

  insertIfNeeded('artist', {name: album.artistName}, {name: album.artistName})
  .then(function(artistId) {
      artistId = artistId[0].id || artistId[0];
      insertIfNeeded('album',{
                  title: album.collectionName,
                  artist_id: artistId,                      ///INSERT ALBUM
                  genre: album.primaryGenreName,
                  year: album.releaseDate.slice(0,4),
                  art_url60: album.artworkUrl60,
                  art_url100: album.artworkUrl100
                 }
                 ,{title: album.collectionName, artist_id: artistId})
      .then(function(albumId) {
        albumId = albumId[0].id || albumId[0];
        knex('users').select('id').where({username: username})
        .then(function(userId){
          userId = userId[0].id;
          insertIfNeeded('album_impression', { user_id: userId, album_id: albumId}
                      , {user_id: userId, album_id: albumId})
          .then(function(impressId) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~impid,date ', impressId, date);
            impressId = impressId[0].id || impressId[0];
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~impid,date ', impressId, date);
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
              });
          })
        })
      })
  })


})


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
