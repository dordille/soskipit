module.exports = class PermaView extends require 'views/base-view'

  el: '#content'
  templateName: 'perma'

  events:
    'click .skip':        'skip'
    'click .help-button': 'toggleHelp'
    'click #submit':      'submit'


  uiMap: _.extend _.clone(@::uiMap),
    'tape':         '.tape'
    'questionText': 'input[name="question_text"]'
    'helpText':     '.help-text'


  initialize: (app) ->
    

  viewData: () ->
    return {
      ask: @model.toJSON()
    }

  submit: () =>
    @model.set 'question_text', @ui.questionText.val()
    @model.submitQuestion()


