env = process.env.NODE_ENV || 'development'

tumblr =
  consumerKey: process.env.TUMBLR_CONSUMER_KEY
  consumerSecret: process.env.TUMBLR_CONSUMER_SECRET

switch env
  when 'development'
    mongo =
      uri: 'mongodb://localhost/skipit'

    redis =
      port: '6379'
      host: 'localhost'

    tumblr.callbackURL = 'http://localhost:3000/auth/tumblr/callback'
  when 'production'
    mongo =
      uri: process.env.MONGOHQ_URL

    redis =
      port: process.env.REDIS_PORT
      host: process.env.REDIS_HOST
      auth: process.env.REDIS_AUTH

    tumblr.callbackURL = 'http://soskipit.com/auth/tumblr/callback'
    

module.exports =
  mongo: mongo
  redis: redis
  tumblr: tumblr
