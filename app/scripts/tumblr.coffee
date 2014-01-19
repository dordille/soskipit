#!/usr/bin/env node

# Module dependencies.

program = require 'commander'
config = require '../config'

program
  .version('0.0.1')
  .option('-p, --post <s>', 'Post ID')
  .parse(process.argv)


# Database Configuration
mongoose = require 'mongoose'
mongoose.connect config.mongo.uri
User = require('../models/user')(mongoose)
Ask  = require('../models/ask')(mongoose)

query = Ask.findOne('_id': program.post)
  .populate('responder')
  .populate('asker')

query.exec (err, ask) ->
  console.log ask
  ask.ask (err, ask) ->
    console.log err
    console.log ask
    ask.answer (err, ask) ->
      console.log ask