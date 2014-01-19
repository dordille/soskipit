Ask = require 'models/ask'

module.exports = class User extends Backbone.Model

  getCurrentAsk: (fn) ->
    def = $.Deferred()
    req = $.get '/answer'

    req.done (data) ->
      def.resolve new Ask data

    req.fail def.reject.bind()

    return def.promise()

  skipCurrentAsk: (fn) ->
    def = $.Deferred()
    req = $.post '/ask/skip'

    req.done (data) ->
      def.resolve new Ask data

    req.fail def.reject.bind()

    return def.promise()