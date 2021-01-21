/*
  dependencies
*/

  const express = require('express')

/*
  config - express
*/

  const app = express()

/*
  endpoint - posts
*/

  app.get('/posts', (request, response) => {
    let posts = [
      {
        caption: 'Luis I bridge',
        location: 'Porto, Portugal'
      },
      {
        caption: 'London Eye',
        location: 'London, United Kingdom'
      }
    ]
    response.send(posts)
  })

/*
  listen
*/

  app.listen(process.env.PORT || 3000)