{mongoose}  = require '../bootstrap'
{User}      = require '../bootstrap'
{Ask}       = require '../bootstrap'
{fixtures}  = require '../bootstrap'
should      = require 'should'

describe 'ask', ->

  beforeEach (done) ->
    fixtures done

  describe 'ask', ->

    it 'should create an ask post on tumblr and update ask fields', (done) ->
      @timeout 5000
      Ask.findOne(response_text: 'Yellow').populate('responder').populate('asker').exec (err, ask) ->
        ask.ask (err, ask) ->
          should.exist ask.ask_post
          ask.answer (err, ask) ->

            done()

  
  # describe 'answer', ->

  #   it 'should create an answer post on tumblr and update ask fields', (done) ->
  #     done()