Tumblr = require 'tumblr.js'
config = require '../config'

Tumblr.Client.prototype.ask = (tumblelog, options, fn) ->
  this._post "/blog/#{tumblelog}/ask", options, fn

Tumblr.Client.prototype.answer = (tumblelog, options, fn) ->
  this._post "/blog/#{tumblelog}/question/reply", options, fn

Tumblr.createClient = (credentials) ->
  credentials.consumer_key = credentials.consumer_key || config.tumblr.consumerKey
  credentials.consumer_secret = credentials.consumer_secret || config.tumblr.consumerSecret

  return new Tumblr.Client credentials

module.exports = Tumblr
