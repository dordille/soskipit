
module.exports = (app) ->
  Ask = app.get 'ask'

  app.get '/', (req, res) ->
    if req.user
      locals = user: req.user.toObject()
    res.render 'layout', locals

  app.get '/answer', (req, res) ->
    return res.json 404, false if req.user.needs_to_ask
    req.user.getCurrentAsk (err, ask) ->
      # If there is an ask return it
      return res.json ask.toObject() if ask

      # Find a new ask for the user
      req.user.getNewAsk null, (err, ask) ->
        return res.json ask.toObject() if ask
        return res.json 404, false

  app.post '/ask/skip', (req, res) ->
    return res.json 404, err if req.user.needs_to_ask
    
    req.user.getCurrentAsk (err, ask) ->
      return res.json 404, err if err

      req.user.skipCurrentAsk (err, ask) ->
        return res.json ask

  app.get '/ask/:id', (req, res) ->
    Ask.findOne('_id': req.params.id)
      .populate('responder')
      .populate('asker')
      .exec()
      .then (ask) ->
        return res.json ask.toObject() if ask
        return res.json 404, false

  app.post '/answer', (req, res) ->
    return res.json 403, err if req.user.needs_to_ask

    req.user.getCurrentAsk (err, ask) ->
      return res.json 403, err if err

      req.user.answer ask, req.body.response_text, (err, user) ->
        return res.json 404, err if err

        ask.ask (err, ask) ->
          ask.answer (err, ask) ->

        res.json ask.toObject()


  app.post '/ask', (req, res) ->
    return res.json 404, 'User does not need to ask' if not req.user.needs_to_ask
    req.user.getCurrentAsk (err, ask) ->
      # User can't submit an ask if they have a pending question
      # return res.json 404, err if ask
      # Create ask
      req.user.ask req.body.question_text, (err, ask) ->
        console.log err
        # Get a new ask for user
        req.user.getNewAsk null, (err, ask) ->
          res.json ask
