/*
  dependencies
*/

  const express = require('express')
  const admin = require('firebase-admin')
  let inspect = require('util').inspect;
  let Busboy = require('busboy');

/*
  config - express
*/

  const app = express()

/*
  config firebase
*/

  const serviceAccount = require('./serviceAccountKey.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })

  const db = admin.firestore()

/*
  endpoint - posts
*/

  app.get('/posts', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')

    let posts = []
    db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
      snapshot.forEach((doc) => {
        posts.push(doc.data())
      })
      response.send(posts)
    })
  })

/*
  endpoint - createPost
*/

app.post('/createPost', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')

  var busboy = new Busboy({ headers: request.headers })

  let fields = {}

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished')
    });
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    fields[fieldname] = val
  });

  busboy.on('finish', function() {
    db.collection('posts').doc(fields.id).set({
      id: fields.id,
      caption: fields.caption,
      location: fields.location,
      date: parseInt(fields.date),
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/sergio-s-gram.appspot.com/o/luisIbridge.jpg?alt=media&token=3efa1638-5612-49eb-94b0-cd50faed07cd'
    })
    response.send('Done parsing form')
  });

  request.pipe(busboy)
})

/*
  listen
*/

  app.listen(process.env.PORT || 3000)