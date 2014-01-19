
module.exports = (app) ->
  User = app.get 'user'

  app.get '/user', (req, res) ->
    return res.json false unless req.isAuthenticated()
    return res.json req.user.profile()