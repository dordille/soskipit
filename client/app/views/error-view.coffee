module.exports = class ErrorView extends require 'views/base-view'

  el: '#content'
  templateName: 'error'

  initialize: (@app) ->

