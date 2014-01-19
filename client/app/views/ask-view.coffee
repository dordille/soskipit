module.exports = class AskView extends require 'views/base-view'

  el: '#content'
  templateName: 'ask'

  events:
    'click .skip':        'skip'
    'click .help-button': 'toggleHelp'
    'click #ask':         'ask'


  uiMap: _.extend _.clone(@::uiMap),
    'tape':         '.tape'
    'questionText': 'textarea'
    'helpText':     '.help-text'


  initialize: (@app) ->
    
  viewData: () =>
    return {
      ask: @model.toJSON()
    }

  ask: (event) =>
    event.preventDefault()
    @model.set 'question_text', @ui.questionText.val()
    @model.submitQuestion(app.user).done () =>
      @unbind()
      app.router.navigate 'answer'

