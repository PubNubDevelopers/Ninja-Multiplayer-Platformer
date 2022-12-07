# Ninja Multiplayer Platformer Game in Real Time #

⚠️ This tutorial is out of date: While some information may not be entirely up to date, this article still contains valuable insights into creating an HTML5 multiplayer platformer game playable entirely in the browser. You can learn more about how PubNub powers [thousands of customers](https://www.pubnub.com/customers/) worldwide in our [PubNub for Developers](https://www.pubnub.com/developers/) resources. Have suggestions or questions about the content of this post? Reach out to devrel@pubnub.com.⚠️

Learn how to build a real-time multiplayer game with PubNub in the browser using HTML, CSS, JavaScript, and the Phaser framework by following the step-by-step [tutorial](https://www.pubnub.com/blog/javascript-multiplayer-game/).

![Screenshot](readmepics/screenshot1.png)

This respository contains the online multiplayer game Ninja Platformer, a browser-based collaborative puzzle game written in less than 1000 lines of code that encourages you to work with your friends to collect the keys to complete the levels. The game is built using [Phaser](https://phaser.io/), an HTML5 game development framework for Canvas and WebGL browser games designed for web and mobile games, as well as HTML, CSS, and JavaScript. Using Phaser's Arcade Physics Library, each character and object has its own physics body with its own set of physics properties and the levels themselves are generated via [JSON](https://www.pubnub.com/learn/glossary/what-is-json/) files.

To ensure that multiple players at a time can enjoy a smooth, reliable gameplay experience, [PubNub](https://www.pubnub.com/blog/pubnub-what-is-it-and-why-do-you-need-it/) is used to power the infrastructure used to communicate this real-time information between these players and other [social features](https://www.pubnub.com/industry/gaming/) to help make online games feel more interactive. 

Follow the [tutorial](https://www.pubnub.com/blog/javascript-multiplayer-game/) to learn about how each of these languages and technologies enables you to create your own browser-based multiplayer game.

## Environment Setup
In order to start the development process, you are going to need to prepare a few prerequisites.
* A text editor such as Visual Studio Code.
* Node.js
* Terminal / Console
* A local web server (either [http-server](https://www.npmjs.com/package/http-server) or [browser-sync](https://browsersync.io/)). Follow the instructions to install and run these local web servers.
* A [PubNub Account](https://admin.pubnub.com/#/login). A PubNub account is always free, and is necessary to obtain the API keys necessary for online play.

## PubNub Account Setup
To build an application that leverages PubNub's real-time data APIs, you need to sign up for your [account](https://admin.pubnub.com/#/login) to obtain API keys. Remember, PubNub will serve as the server-side infrastructure that powers the online multiplayer functionality of the game.

Once you have successfully signed up you will be taken to the admin page, where you can create an application that is associated with specific projects, and keysets associated with those projects (development, testing, production, etc) in order to obtain the publish/subscribe keys necessary to connect to the PubNub network. Please view this how-to guide to learn how to create an application, keyset, and obtain keys.
Once you’re in the Admin Dashboard, name your application whatever you wish, and click the Create New App button. Once you create the application, click on the application and create a new keyset.

Click on the keyset, and it should load up a page that shows your keys in addition to features you can enable for your keys. You'll need to enable a few different features in your keyset for this application. You'll need to enable Presence to detect when new users come online, as well as check the Generate Leave on TCP FIN or RST setting. Also, enable Message Persistence to persist messages as they are published. Click on the Save Changes button to save the changes. Copy and save the publish and subscribe keys as you'll need these later on.

PubNub's [Functions](https://www.pubnub.com/docs/general/functions/functions/overview) feature is used to keep game states consistent for all connected players. On the left-hand side of the dashboard, click the Functions box. Click the Create Module button and name it whatever you wish. Then create a new Function and call it what you would like as well. Make sure you select Before Publish or Fire and the channel name is realtimephaserFire2.
Copy the following code into the portal, where you are able to enter your own JS functionality.

```javascript
export default (request) => { 
    const pubnub = require('pubnub');
    const db = require('kvstore');
    const xhr = require('xhr');
    const keyName = "gamestate2_" + request.message.currentLevel;
    if(request.message.int || request.message.fromServer) {
        return request.ok(); // Return a promise when you're done 
    }
    if(request.message.requestInt){
      db.get(keyName).then((value) => {
            pubnub.publish({
                "channel": "realtimephaserFire2",
                "message": {
                    value: value,
                    int: true,
                    sendToRightPlayer: request.message.uuid
                }
            }).then((publishResponse) => {
                //console.log(publishResponse);
            });
        });
        return request.ok(); // Return a promise when you're done
    }
    console.log("spitout", request.message)
    pubnub.time().then((timetoken) => {
        db.get(keyName).then((value) => {
            if(value === null || value.time < request.message.time || true) {
                value = {time: timetoken, coinCache: request.message.coinCache};
                db.set(keyName, value, 1);
                 console.log('set', keyName, value);
            }
            pubnub.publish({
                "channel": "realtimephaserFire2",
                "message": {value: value, fromServer: true}
            }).then((publishResponse) => {
                //console.log(publishResponse);
            });
        });
    });
    return request.ok(); // Return a promise when you're done 
};
```

The information saved and processed is the contents of the JSON-level information that was sent earlier. The function essentially determines that if JSON information exists in the Function, publish that information to the newly connected user. If there is no information, use the local JSON information for that client. The only time the JSON updates in the PubNub Function is when a coin is collected in the scene by any player.
Now click the + button in the PubNub Functions dashboard and create a new function and name it onLeave except call it only After Presence and on the channel realtimephaserFire2. Add the following code to the function.

```javascript
export default (request) => { 
    const pubnub = require('pubnub');
    const db = require('kvstore');
    const xhr = require('xhr');
    if(request.message.occupancy === 0){ 
        for(var currentLevel = 0; currentLevel < 100; currentLevel++) {
            const keyName = "gamestate2_" + currentLevel;
            db.removeItem(keyName);
        }
    }
    return request.ok(); // Return a promise when you're done 
}
```

This PubNub Function will only run when someone joins, leaves, or timeouts a channel. If the total occupancy of the game equals zero, it resets the current level cache to nothing so the coins will appear for anyone new that joins the game.

## Build & Run

Before running the game, you will need to add your PubNub publish and subscribe keys from your PubNub account. In js/main.js, navigate to the ```createMyPubNub``` function. Look for the 'ADD-YOUR-PUBNUB-' comments and add your publish and subscribe keys here appropriately.

Save any changes, start the local web server using either ```http-server``` or ```browser-sync start --server --files ="**/*.js"``` depending on your choice of web servers, and begin playing the game.

Move your character using the arrow keys, collect coins, and collect the key necessary to complete the level.

## Links
- PubNub Account: https://admin.pubnub.com/#/login
- JavaScript SDK: https://www.pubnub.com/docs/sdks/javascript
- Tutorial Link: https://www.pubnub.com/blog/javascript-multiplayer-game/

## License
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
