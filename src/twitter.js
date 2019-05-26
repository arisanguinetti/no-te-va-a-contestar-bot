const Twitter = require('twitter');
const dotenv = require('dotenv');

dotenv.config();

const twConfig = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY || null,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET || null,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY || null,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || null,
};

const client = new Twitter(twConfig);

module.exports = client;
