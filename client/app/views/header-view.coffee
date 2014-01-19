module.exports = class HeaderView extends require 'views/base-view'

  el: '#header'
  templateName: 'header'

  events:
    'click .logout':      'logout'
    'click .login':       'login'
    'click .help-button': 'toggleHelp'


  uiMap: _.extend _.clone(@::uiMap),
    'tape':     '.tape'
    'helpText': '.help-text'


  initialize: (app) ->
    

  viewData: () ->
    return {
      user: @model
    }

  logout: (app) ->


  login: (app) ->


