config      = require '../config'
passport    = require 'passport'
{Strategy}  = require 'passport-tumblr'

module.exports = (app) ->
  User = app.get 'user'

  passport.use new Strategy config.tumblr, User.findOrCreate.bind(User)

  passport.serializeUser User.serialize.bind(User)
  
  passport.deserializeUser User.findById.bind(User)

  app.get '/auth/tumblr', passport.authenticate('tumblr')

  app.get '/auth/tumblr/callback', passport.authenticate('tumblr', failureRedirect: '/fail'), (req, res) ->
    res.redirect '/#'

  app.get '/auth/logout', (req, res) ->
    req.logout()
    res.redirect '/#'
    
