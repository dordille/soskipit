ObjectId = require('mongodb').BSONNative.ObjectID;

###
UserSchema = new mongoose.Schema
    username        : type: String, unique: true, index: true
    needs_to_ask    : type: Boolean
    tumblelog       : String
    tumblr          : String
    tumblr_token    : String
    tumblr_secret   : String

AskSchema = new mongoose.Schema
    asker           : type: mongoose.Schema.ObjectId, ref: 'User'
    responder       : type: mongoose.Schema.ObjectId, ref: 'User'
    ask             : type: String
    response        : type: String
    answered        : type: Boolean, default: false
    post            : type: Schema.Types.Mixed

###

module.exports.User =
  needs_to_ask:
    _id: new ObjectId
    username: 'needs_to_ask' 
    needs_to_ask: true
  needs_question:
    _id: new ObjectId
    username: 'needs_question'
    tumblelog: 'errthng.tumblr.com'
  needs_to_answer:
    _id: new ObjectId
    username: 'needs_to_answer'
    tumblelog: 'jaykillah.tumblr.com'
  admin:
    _id: new ObjectId
    username: 'admin'
    tumblelog: 'dordille123.tumblr.com'
  dordille:
    _id: new ObjectId
    username: 'dordille'
    tumblelog: 'dordille.tumblr.com'
    tumblr_token: 'fgivtBWxnNOIYrPGZ0olHpTyN6gmOCbk2bi3Y4rCOy3XPrdW7i'
    tumblr_secret: '4Og2zdalPakQhic3Hy0Yezuo4Wxuk2BWtCoo3wBc02aHKeLi6u'
    needs_to_ask: false
  dordilleadmin:
    _id: new ObjectId
    username: 'dordille-admin'
    tumblelog: 'dordille-admin.tumblr.com'
    tumblr_token: 'gBDcBeo5Y4tcQIXkU5SI0V6br90X9Ldsi7diJ3eUNAsRN8PgFS'
    tumblr_secret: '4O4IMyOpVvbV96NF3lwb2O726l09RMWBdF5XfgBtfF3n73XeaV'


###
AskSchema = new Schema
    asker           : type: Schema.Types.ObjectId, ref: 'User'
    responder       : type: Schema.Types.ObjectId, ref: 'User'
    question_text   : type: String
    response_text   : type: String
    answered        : type: Boolean, default: false
    ask_post        : type: Schema.Types.Mixed
    response_post   : type: Schema.Types.Mixed
###
module.exports.Ask = 
  ask_1:
    asker: exports.User.needs_question._id
    question_text: 'Ask?'
  ask_2:
    asker: exports.User.admin._id
    question_text: 'Ask_2?'
  ask_3:
    asker: exports.User.needs_question._id
    responder: exports.User.needs_to_answer._id
    question_text: 'Ask_3?'
  ask_needs_tumblr:
    asker: exports.User.dordilleadmin._id
    responder: exports.User.dordille._id
    question_text: 'What is your favorite color?'
    response_text: 'Yellow'
    answered: true







