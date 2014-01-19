Ask         = require 'models/ask'
AskView     = require 'views/ask-view'
AnswerView  = require 'views/answer-view'
PermaView   = require 'views/perma-view'
HeaderView  = require 'views/header-view'
ErrorView   = require 'views/error-view'

module.exports = class Router extends Backbone.Router

  routes:
    '':             'home'
    'ask':          'ask'
    'ask/:id':      'perma'
    'answer':       'answer'
    '*notFound':    'notFound'

  initialize: (@options) ->
    @askView = new AskView
    @answerView = new AnswerView
    @errorView = new ErrorView

    {@user} = options
    headerView = new HeaderView(model: @user)
    headerView.render(user: @user)

  navigate: (route) ->
    super route, trigger: true

  home: ->
    if @user
      if @user.get 'needs_to_ask'
        @navigate 'ask'
      else
        @navigate 'answer'
    else
      app.views.home.render()

  ask: ->
    @navigate '/' unless @user
    @navigate 'answer' unless @user.get 'needs_to_ask'

    ask = new Ask
    ask.set 'asker', @user.toJSON()
    @askView.model = ask
    @askView.render()

  answer: ->
    @navigate '/' unless @user
    @navigate 'ask' if @user.get 'needs_to_ask'

    req = app.user.getCurrentAsk()
    req.done (ask) =>
      @answerView.model = ask
      @answerView.render()
    req.fail () =>
      @errorView.render()

  perma: (id) ->
    ask = new Ask
      id: id
    ask.fetch()
      .done () =>
        view = new PermaView
          model: ask
        view.render()
      .fail () =>
        console.log 'fail'

  notFound: ->

