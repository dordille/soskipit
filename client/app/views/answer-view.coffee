module.exports = class AnswerView extends require 'views/base-view'

  el: '#content'
  templateName: 'answer'

  events:
    'click .skip_button':    'skip'
    'click #submit':  'submit'


  uiMap: _.extend _.clone(@::uiMap),
    'tape':     '.tape'
    'responseText': 'textarea'
    'helpText': '.help-text'


  initialize: (@app) ->

  viewData: () =>
    return {
      ask: @model.toJSON()
    }

  submit: (event) =>
    event.preventDefault()
    @model.set 'response_text', @ui.responseText.val()
    @model.set 'responder', app.user.toJSON()
    @model.submitAnswer(app.user).done () =>
      @unbind()
      app.router.navigate 'ask'


  skip: (event) =>
    app.user.skipCurrentAsk().done () =>
      @unbind()
      app.router.navigate ''

        


