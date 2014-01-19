module.exports = class Ask extends Backbone.Model

  url: () ->
    return '/ask/' + @id

  submitQuestion: (user) =>
    req = $.post '/ask', @attributes
    req.done () =>
      user.set 'needs_to_ask', false

    return req

  submitAnswer: (user) =>
    req = $.post '/answer', @attributes
    req.done () =>
      user.set 'needs_to_ask', true

    return req