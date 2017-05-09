export default (request) => {
  const pubnub = require('pubnub');
  const db = require('kvstore');

  const keyName = `gamestate2_${request.message.currentLevel}`;
  if (request.message.int || request.message.fromServer) {
    return request.ok(); // Return a promise when you're done
  }
  // console.log("hi", keyName, request.message)
  if (request.message.requestInt) {
    db.get(keyName).then((value) => {
      pubnub.publish({
        channel: 'realtimephaserFire2',
        message: {
          value,
          int: true,
          sendToRightPlayer: request.message.uuid
        }
      }).then((publishResponse) => {
          // console.log(publishResponse);
      });
    });
    return request.ok(); // Return a promise when you're done
  }
    // console.log("spitout", request.message)

  pubnub.time().then((timetoken) => {
   // console.log("time", timetoken);
    db.get(keyName).then((value) => {
      // console.log('get', keyName, value);
      if (value === null || value.time < request.message.time || true) {
        value = { time: timetoken, coinCache: request.message.coinCache };
        db.set(keyName, value, 1);
        // console.log('set', keyName, value);
      }
       // console.log("value", value);
       // console.log('set', keyName, value);
      // return request.ok();
      pubnub.publish({
        channel: 'realtimephaserFire2',
        message: { value, fromServer: true }
      }).then((publishResponse) => {
        // console.log(publishResponse);
      });
    });
  });
  return request.ok(); // Return a promise when you're done
};
