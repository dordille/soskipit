express     = require 'express'
http        = require 'http'
path        = require 'path'
passport    = require 'passport'
config      = require './config'
redis       = require 'redis'
RedisStore  = require('connect-redis')(express)

# Redis Config
rclient = redis.createClient config.redis.port, config.redis.host
rclient.auth config.redis.auth if config.redis.auth

app = express()

app.set 'port', process.env.PORT || 3000
app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'
app.use express.favicon()
app.use express.logger('dev')
app.use express.json()
app.use express.urlencoded()
app.use express.methodOverride()
app.use express.cookieParser('keyboard cat')
app.use express.session
  store: new RedisStore(client: rclient)
app.use passport.initialize()
app.use passport.session()

app.use express.static(path.join(__dirname, '..', 'public'))
app.use require('express-spa-router') app,
  extraRoutes: ['ask', 'answer']
  ignore: ['auth']
app.use app.router


# Database Configuration
mongoose = require 'mongoose'
mongoose.connect config.mongo.uri
app.set 'user', require('./models/user')(mongoose)
app.set 'ask', require('./models/ask')(mongoose)

# Routes
require('./routes/tumblr') app
require('./routes/user') app
require('./routes/ask') app

server = http.createServer app
server.listen app.get('port'), () ->
  console.log "Express server listening on port " + app.get('port')
