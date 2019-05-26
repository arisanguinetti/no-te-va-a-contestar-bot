const fs = require('fs');

let client;

const pathToMovie = './notevaacontestar.mp4';
const mediaType = 'video/mp4'; // `'video/mp4'` is also supported
const mediaData = fs.readFileSync(pathToMovie);
const mediaSize = fs.statSync(pathToMovie).size;

const makePost = (endpoint, params) =>
  new Promise((resolve, reject) => {
    client.post(endpoint, params, (error, data, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

/**
 * Step 1 of 3: Initialize a media upload
 * @return Promise resolving to String mediaId
 */
const initUpload = () =>
  makePost('media/upload', {
    command: 'INIT',
    total_bytes: mediaSize,
    media_type: mediaType,
  }).then(data => data.media_id_string);

/**
 * Step 2 of 3: Append file chunk
 * @param String mediaId    Reference to media object being uploaded
 * @return Promise resolving to String mediaId (for chaining)
 */
const appendUpload = mediaId =>
  makePost('media/upload', {
    command: 'APPEND',
    media_id: mediaId,
    media: mediaData,
    segment_index: 0,
  }).then(data => mediaId);

/**
 * Step 3 of 3: Finalize upload
 * @param String mediaId   Reference to media
 * @return Promise resolving to mediaId (for chaining)
 */
const finalizeUpload = mediaId =>
  makePost('media/upload', {
    command: 'FINALIZE',
    media_id: mediaId,
  }).then(data => mediaId);

const retrieveMediaId = async twitterClient => {
  client = twitterClient;
  const mediaId = await initUpload() // Declare that you wish to upload some media
    .then(appendUpload) // Send the data for the media
    .then(finalizeUpload); // Declare that you are done uploading chunks
  return mediaId;
};

module.exports = { retrieveMediaId };
