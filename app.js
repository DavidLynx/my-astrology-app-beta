const express = require('express')
const path = require('path');
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')))

// ensure root serves public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.set('trust proxy', 'loopback')

// cors
app.use(cors())

if (process.env.ENVIRONMENT !== 'test') {
  // logger
  app.use(
    morgan(
      '[:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'
    )
  )
}

// helmet configurations
app.use(helmet())

app.use(helmet.referrerPolicy())

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"]
    }
  })
)

app.use(
  helmet.featurePolicy({
    features: {
      fullscreen: ["'self'"],
      vibrate: ["'none'"],
      syncXhr: ["'none'"]
    }
  })
)

app.use(express.json())

const api = require('./src/api')

app.use(api)

module.exports = app
