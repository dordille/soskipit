
module.exports = class GlobalView extends require 'views/base-view'

  el: '#content'
  templateName: 'global'

  events:
    'click .skip':        'skip'
    'click .help-button': 'toggleHelp'


  uiMap: _.extend _.clone(@::uiMap),
    'tape':     '.tape'
    'helpText': '.help-text'


  initialize: (app) ->
    $.when(app.domReady).then @render



