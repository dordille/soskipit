User        = require 'models/user'  
Router      = require 'lib/router'
HomeView    = require 'views/home-view'
GlobalView  = require 'views/global-view'

class AskRoulette

  constructor: (user) ->
    if user
      @user = new User user

    @router   = new Router user: @user
    domDef    = $.Deferred()
    @domReady = domDef.promise()
    @views    = 
      global: new GlobalView @
      home: new HomeView @

    $ =>
      domDef.resolve()
      Backbone.history.start pushState: true


module.exports = (user) ->
  window.app = new AskRoulette(user)

