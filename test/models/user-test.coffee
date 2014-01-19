{mongoose}  = require '../bootstrap'
{User}      = require '../bootstrap'
{Ask}       = require '../bootstrap'
{fixtures}  = require '../bootstrap'
should      = require 'should'

describe 'user', ->

  beforeEach (done) ->
    fixtures done

  describe 'getCurrentAsk', ->

    it 'should return no ask for a user that already has an ask', (done) ->
      done()

    it 'should return an ask for a user that has an unanswered ask', (done) ->
      User.findOne username: 'needs_to_answer', (err, user) ->
        user.getCurrentAsk (err, ask) ->
          ask.responder.username.should.equal user.username
          ask.answered.should.be.false
          done()

  describe 'skipCurrentAsk', ->

    user = ask = null
    beforeEach (done) ->
      User.findOne username: 'needs_to_answer', (err, _user) ->
        user = _user
        user.getCurrentAsk (err, _ask) ->
          ask = _ask
          done()

    it 'should skip the current ask and give the user a new ask', (done) ->
      user.skipCurrentAsk (err, newAsk) ->
        should.exist newAsk
        newAsk.id.should.not.equal ask.id
        newAsk.responder.username.should.equal user.username
        done()
          
    it 'should free up previous question', (done) ->
      user.skipCurrentAsk (err, newAsk) ->
        Ask.findById ask.id, (err, ask) ->
          should.not.exist ask.responder
          done()


  describe 'answerCurrentAsk', ->

    it 'should answer an ask and put the user into the asking state', (done) ->
      User.findOne username: 'needs_to_answer', (err, user) ->
        user.getCurrentAsk (err, ask) ->
          user.answer ask, 'I like red', (err) ->
            ask.response.should.equal 'I like red'
            ask.responder.should.not.be.null
            ask.responder.should.equal user
            ask.answered.should.be.true
            done()

  describe 'ask', ->

    it 'should create an ask and clear the need to ask state', (done) ->
      User.findOne username: 'needs_to_ask', (err, user) ->
        user.ask 'What is your favorite color?', (err, ask) ->
          should.exist ask
          ask.question_text.should.equal 'What is your favorite color?'
          user.needs_to_ask.should.be.false
          done()

  # describe 'createAsk', ->

  #   it 'should not allow a user to ask if not in asking state', (done) ->
  #     done()

  #   it 'should allow a user to submit an ask and move them to the answer state', (done) ->
  #     done()