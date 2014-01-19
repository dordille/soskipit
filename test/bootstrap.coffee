config = require '../app/config'

# Database Configuration
mongoose = require 'mongoose'
connection = mongoose.connect config.mongo.uri

powFixtures = require 'pow-mongoose-fixtures'
fixtures = (fn) ->
  # Load Fixtures
  powFixtures.load __dirname + '/fixtures', connection, fn
    

module.exports = 
  mongoose: mongoose
  User: require('../app/models/user') mongoose
  Ask: require('../app/models/ask') mongoose
  fixtures: fixtures