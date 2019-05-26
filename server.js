const client = require('./src/twitter');
const { retrieveMediaId } = require('./src/uploadVideo');

const stream = client.stream('statuses/filter', {
  track: '@CableFibertel,@ClaroArgentina,@EdenorClientes',
});

stream.on('data', event => {
  const {
    // eslint-disable-next-line camelcase
    id_str,
    // eslint-disable-next-line camelcase
    in_reply_to_status_id,
    // eslint-disable-next-line camelcase
    in_reply_to_user_id,
    // eslint-disable-next-line camelcase
    is_quote_status,
    // eslint-disable-next-line camelcase
    retweeted_status,
    user,
  } = event;

  if (
    // eslint-disable-next-line camelcase
    in_reply_to_status_id == null &&
    // eslint-disable-next-line camelcase
    in_reply_to_user_id == null &&
    // eslint-disable-next-line camelcase
    retweeted_status == null &&
    // eslint-disable-next-line camelcase
    is_quote_status === false
  ) {
    console.log(`Sending Reply`);
    retrieveMediaId(client).then(mediaId => {
      const tweetData = {
        status: `No te va a contestar, no te va a contestar! Es un botón! @${
          user.screen_name
        }`,
        // eslint-disable-next-line camelcase
        in_reply_to_status_id: `${id_str}`,
        // eslint-disable-next-line camelcase
        media_ids: mediaId,
      };

      client.post('statuses/update', tweetData, function(
        error,
        tweet,
        response
      ) {
        if (error) {
          console.log(error);
        }
      });
    });
  } else {
    console.log(`Not sending reply`);
  }
});

stream.on('error', error => {
  throw error;
});
