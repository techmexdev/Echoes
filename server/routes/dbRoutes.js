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
      .select('users.user',
              'album_impression.date',
              'album.title', 'artist.name', 'album.genre', 'album.year',
              'album_impression.rating', 'album_impression.impression', 'album_impression.id',
              'album.art_url60', 'album.art_url100')
      .orderBy('album_impression.date', 'desc')
      .then(function (result) {
        // send the result back to the user
        res.status(200).send(result);
      })
      .catch(function (err) {
        console.log('Problem grabbing user info');
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
    console.log('', errMessage, e);
    throw e;
  });
}

//post new album to the database
router.post('/', function(req, res) {
  var album = req.body.album;
  var date = req.body.date.slice(0, 10); ///full date
  var username = req.cookies.username;

  insertIfNeeded('artist', {name: album.artistName}, {name: album.artistName})
  .then(function(artistId) {
      artistId = artistId[0].id || artistId[0];
      insertIfNeeded('album',{
                  title: album.collectionName,
                  artist_id: artistId,                      ///INSERT ALBUM
                  genre: album.primaryGenreName,
                  year: album.releaseDate.slice(0,4),
                  art_url60: album.albumArtUrl,
                  art_url100: album.albumArtUrl
                 }
                 ,{title: album.collectionName, artist_id: artistId})
      .then(function(albumId) {
        albumId = albumId[0].id || albumId[0];
        knex('users').select('id').where({username: username})
        .then(function(userId){
          userId = userId[0].id || artistId[0];

          insertIfNeeded('album_impression',
                          { user_id: userId, album_id: albumId, date:date },
                          { user_id: userId, album_id: albumId, date:date })
          .then((id)=>{
            var i = id[0].id || id[0];
            res.status(201).send(JSON.stringify(i));
          })
          .catch((e)=>{
            res.status(401).send('error occurred' + e)
          });
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
      impression: impress.impression,
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
  var listenEntry = req.body; //.impressionId and .date
  //find the listen_date Entry
  knex('album_impression')
    .where('id', req.body.impressionId)
    .del()
    .then(function() {
      res.status(201).send('Successfully removed album');
    });
});

module.exports = router;
