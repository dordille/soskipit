timestamps = require "mongoose-times"

module.exports = (mongoose, redis) ->
  Schema = mongoose.Schema

  AskSchema = new Schema
    asker           : type: Schema.Types.ObjectId, ref: 'User'
    responder       : type: Schema.Types.ObjectId, ref: 'User'
    question_text   : type: String
    response_text   : type: String
    answered        : type: Boolean, default: false
    answered_on     : type: Date
    ask_post        : type: Schema.Types.Mixed
    response_post   : type: Schema.Types.Mixed
    random          : type: Array
      , default: () -> 
        return [Math.random(), Math.random()]
      , index: '2d'

  AskSchema.plugin timestamps


  AskSchema.options.toObject = AskSchema.options.toObject || {}

  # Returns
  AskSchema.options.toObject.transform = (doc, ret, options) ->
    delete ret._id
    ret.asker = doc.asker.toObject() if doc.asker
    ret.responder = doc.responder.toObject() if doc.responder

    return ret

  # Creates an ask post on Tumblr
  AskSchema.methods.ask = (fn) ->
    @asker.tumblr().ask @responder.tumblelog, question: @question_text, (err, res, body) =>
      @responder.tumblr().submissions @responder.tumblelog, (err, res) =>
        for post in res.posts
          if post.asking_name == @asker.username && post.question == @question_text
            @ask_post = post
            return @save fn

  AskSchema.methods.answer = (fn) ->
    @responder.tumblr().answer @responder.tumblelog, { 
      answer: @response_text, 
      post_id: @ask_post.id,
      source_url: 'http://soskipit.com/ask/' + @id,
      tags: 'soskipit'
    },
    (err, res) =>
      @responder.tumblr().posts @responder.tumblelog, { id: res.id }, (err, res) =>
        @response_post = res.posts[0]
        @answered = true
        @answered_on = Date.now
        return @save fn


  Ask = mongoose.model 'Ask', AskSchema

  return Ask

