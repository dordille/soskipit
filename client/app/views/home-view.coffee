module.exports = class HomeView extends require 'views/base-view'

  el: '#content'
  templateName: 'home'

  events:
    'click .skip':        'skip'
    'click .help-button': 'toggleHelp'


  uiMap: _.extend _.clone(@::uiMap),
    'tape':     '.tape'
    'helpText': '.help-text'


  initialize: (app) ->
    


