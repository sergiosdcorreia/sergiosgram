/*
  dependencies
*/

  const express = require('express')
  const admin = require('firebase-admin')
  let inspect = require('util').inspect
  let Busboy = require('busboy')
  let path = require('path')
  let os = require('os')
  let fs = require('fs')
  let UUID = require('uuid-v4')
  let webpush = require('web-push')

/*
  config - express
*/

  const app = express()

/*
  config firebase
*/

  const serviceAccount = require('./serviceAccountKey.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://sergio-s-gram.appspot.com"
  })

  const db = admin.firestore()
  let bucket = admin.storage().bucket()

/*
  config - webpush
*/

webpush.setVapidDetails(
  'mailto: sergioseoblog@gmail.com',
  'BDpbI_84r87m8i45uraYM1NejGD0_v4eiY66-H4ATYOjI_JHukhqF8qXoFq9ii3Teu7E8feOOZ9OJxVupKvU5zs', // public key
  'xcXeeCoruWYcIv-QnMRLx7aJpr_sIwK48Ay3CBQ51f0' // private key
)

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

  let uuid = UUID()

  var busboy = new Busboy({ headers: request.headers })

  let fields = {}
  let fileData = {}

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)
    // /tmp/5345443-5345443.png
    let filepath = path.join(os.tmpdir(), filename)
    file.pipe(fs.createWriteStream(filepath))
    fileData = { filepath, mimetype }
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    fields[fieldname] = val
  });

  busboy.on('finish', function() {

    bucket.upload(
      fileData.filepath,
      {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile)
        }
      }
    )

    function createDocument(uploadedFile) {
      db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploadedFile.name }?alt=media&token=${ uuid }`
      }).then(() => {
        sendPushNotification()
        response.send('Post added: ', fields.id)
      })
    }
    function sendPushNotification() {
      
      let subscriptions = []
      db.collection('subscriptions').get().then(snapshot => {
        snapshot.forEach((doc) => {
          subscriptions.push(doc.data())
        })
        return subscriptions
      }).then(subscriptions => {
        subscriptions.forEach(subscription => {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.keys.auth,
              p256dh: subscription.keys.p256dh
            }
          }
          let pushContent = {
            title: 'New SergiosGram post!',
            body: 'New Post Added! Check it out!',
            openUrl: '/#/'
          }
          let pushContentStringified = JSON.stringify(pushContent)
          webpush.sendNotification(pushSubscription, pushContentStringified)
        })
      })
    }
  });

  request.pipe(busboy)
})

app.post('/createSubscription', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  db.collection('subscriptions').add(request.query).then(docRef => {
    response.send({
      message: 'subscription added!',
      postData: request.query
    })
  })
})

/*
  listen
*/

  app.listen(process.env.PORT || 3000)