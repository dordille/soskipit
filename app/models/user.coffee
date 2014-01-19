Tumblr = require '../lib/tumblr'

module.exports = (mongoose) ->
  
  UserSchema = new mongoose.Schema
    username        : type: String, unique: true, index: true
    needs_to_ask    : type: Boolean, default: true
    tumblelog       : String
    tumblr_token    : String
    tumblr_secret   : String

  UserSchema.options.toObject = UserSchema.options.toObject || {}
  UserSchema.options.toObject.virtuals = true

  UserSchema.options.toObject.transform = (doc, ret, options) ->
    delete ret._id
    delete ret.tumblr_token
    delete ret.tumblr_secret

    return ret

  # Given results of successful passport Tumblr auth, save user date to db
  UserSchema.statics.findOrCreate = (token, tokenSecret, profile, fn) ->
    # Assemble Tumblr User object
    user =
      username:       profile.username
      tumblelog:      profile.username + '.tumblr.com'
      tumblr_token:   token
      tumblr_secret:  tokenSecret

    # Check for matching tumblr ID - if unique, create record, otherwise update
    @findOneAndUpdate { 'username': profile.username }, { $set: user }, { upsert: true, 'new': true }, (err, user) ->
      fn err, user

  UserSchema.statics.findAndModify = (query, sort, doc, options, fn) ->
    @collection.findAndModify query, sort, doc, options, fn

  UserSchema.statics.findByUsername = (username, fn) ->
    @findOne 'username': username, (err, user) ->
      fn err, user

  UserSchema.statics.serialize = (user, fn) ->
    fn null, user._id

  UserSchema.statics.deserialize = (username, fn) ->
    @findOne 'username': username, fn

  # Virtuals
  
  UserSchema.virtual('avatars').get () ->
    sizes = {}
    for size in [16, 24, 30, 40, 48, 64, 96, 128, 512]
      sizes[size] = @avatar size
    
    return sizes

  # Methods

  UserSchema.methods.avatar = (size = 64) ->
    return 'http://api.tumblr.com/v2/blog/' + @tumblelog + '/avatar/' + size

  UserSchema.methods.profile = () ->
    return { username: @username, avatar: @avatar() }

  ###
  Gets the user's current state
  ###
  UserSchema.methods.state = () ->
    return 'ask'

  UserSchema.methods.getCurrentAsk = (fn) ->
    Ask = mongoose.model 'Ask'
    Ask.findOne({ responder: @, answered: false }).populate('responder').populate('asker').exec fn

  UserSchema.methods.getNewAsk = (ask, fn) ->
    Ask = mongoose.model 'Ask'
    
    query = Ask.findOneAndUpdate( responder: @ )
      .populate('responder')
      .populate('asker')
      .where('random').near([Math.random(), Math.random()])
      .where('answered').equals(false)
      .where('asker').ne(@_id)
      .where('responder').equals(null)
    
    if ask
      query.where('_id').ne(ask.id)
      
    query.exec fn
    
  UserSchema.methods.skipCurrentAsk = (fn) ->
    Ask = mongoose.model 'Ask'
    @getCurrentAsk (err, ask) =>
      ask.set 'responder', null
      if ask
        ask.save (err, ask) =>
          @getNewAsk ask, fn
      else
        @getNewAsk ask, fn

  UserSchema.methods.answer = (ask, response, fn) ->
    ask.response_text = response
    ask.set 'responder', @
    ask.answered = true
    ask.save (err, ask) =>
      @set 'needs_to_ask', true
      @save fn

  UserSchema.methods.ask = (text, fn) ->
    Ask = mongoose.model 'Ask'
    ask = new Ask
      question_text: text
      asker: @
    ask.save (err, ask) =>
      @needs_to_ask = false
      @save (err, user) ->
        fn err, ask

  UserSchema.methods.tumblr = () ->
    Tumblr.createClient
      token: @tumblr_token
      token_secret: @tumblr_secret


  User = mongoose.model 'User', UserSchema

  return User
