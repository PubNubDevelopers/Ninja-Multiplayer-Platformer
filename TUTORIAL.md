# Realtime Multiplayer Game with PubNub Tutorial #

## Table of Contents
* [Setup Your Machine](#setup)
* [Launch a Local Server](#launchserver)
* [Setting Up PubNub](#pubnub)
* [Initialize Phaser](#initialize)
* [Create loadingState.js](#loadingstate)
* [Display Assets on the Screen](#assets)

## <a name="setup"></a>Setup Your Machine

In order to prepare your machine for HTML5 game development, you are going to need a few tools on your system.  Luckily, you may already have some if you have done development in the past.  This tutorial is aimed at people from all levels since it uses the minimum amount of tools necessary for development. 

What you will need to make an HTML5 game:
* Text Editor
* Access to terminal / console on your computer
* A local web server

### Text Editor

You will use a text editor to code your game.  There are tons of text editors out there.  Choose whichever one you like best:

* <a href="http://sublimetext.com" target="_blank">Sublime Text</a>
* <a href="http://atom.io/" target="_blank">Atom</a>
* <a href="http://brackets.io/" target="_blank">Brackets</a>
* <a href="http://www.vim.org" target="_blank">Vim</a>

### Terminal

You are going to need access to the terminal / command prompt in order to launch your local web server. 
* On Windows, it's called <b>Command Prompt</b> and you can access it by going to ``Start > Run > cmd``
* On MacOS, it's called <b>Terminal</b> app and you can find it in the ``Applications`` folder or by typing hitting the ``Command + Space`` for Spotlight then type in ``Terminal``.
* On Linux, most distributions have the terminal icon in the dock.  In Ubuntu the application is called <b>Terminal</b>

## <a name="launchserver"></a>Launch a Local Server

In order for the Phaser game engine to run in your browser, you are going to need a local web server.  The reason loading the files without a webserver will not work is because browsers block files from loading from different domains.  Create a folder on the desktop and call it Ninja-Multiplayer-Platformer.

### If you have Node

Execute this line to install the http-server package:

``npm -g install http-server``

Then navigate to the directory where you are going to create your files.

```
cd Desktop
cd Ninja-Multiplayer-Platformer
http-server
```
### A better alternative

You can download a tool called Browser Sync which will automatically reload the browser every time you modify a file.

``npm -g install browser-sync``

This will launch the server and reload the browser when you modify any Javascript file.

```
cd Desktop
cd Ninja-Multiplayer-Platformer
browser-sync start --server --files ="**/*.js"
```

### Mac OS or Linux (or Python installed on your system)

Go to your terminal application and run this:

```
cd Desktop
cd Ninja-Multiplayer-Platformer
python -m SimpleHTTPServer
```

If you don't have Node or Python, checkout <a href="https://phaser.io/tutorials/getting-started/part2">this link</a> for more details on how to setup your system.

## <a name="pubnub"></a>Setting Up PubNub

### Pub/Sub In a Nutshell

PubNub utilizes a Publish/Subscribe model for realtime data streaming and device signaling which lets you establish and maintain persistent socket connections to any device and push data to global audiences in less than ¼ of a second.

You can publish messages to any given channel, and subscribing clients receive only messages associated with that channel. The message payload can be any JSON data including numbers, strings, arrays, and objects.

### Pub/Sub Use Cases and Scenarios

* Chat rooms: Sending and receiving messages
* Locations and Connected cars: dispatching taxi cabs
* Smart sensors: Receiving data from a sensor for data visualizations
* Health: Monitoring heart rate from a patient's wearable device
* Multiplayer gamings
* Interactive media: audience-participating voting system
* And many many more...

### Setting up Your PubNub Account

To build an application that leverages the PubNub Data Stream, you need to <a href="https://admin.pubnub.com/#/register">sign up</a> for your account to obtain API keys.

Once you have successfully signed up you will be taken to the admin page.

You can edit the app name by clicking the App name ("My First PubNub App") and on the next screen by clicking the pencil icon next to the App name.

You should have your *Publish Key* and *Subscribe Key* under your app. (You do not need the *Secret Key* for now. You will only need this when you are using Access Manager APIs).

You can add additional apps by clicking the APPS tab on the top menu bar, then clicking *New App*.

You will get a new set of Publish and Subscribe Keys each time you create a new app.

## <a name="initialize"></a>Initialize Phaser
Download the project assets here: https://github.com/pubnub-dsn/Ninja-Multiplayer-Platformer/raw/tutorialbranch/Tutorial/ProjectAssets.zip *CHANGE LATER*

Now in order to view your website, you have to launch your local web server.  The instructions on how to do that are above.  However when you ``cd`` to your project folder directory, you can run the ``python -m SimpleHTTPServer`` command in terminal.  Then go to your web browser, and type in the IP and port that is listed in terminal.  In some cases you can type in ``localhost:8000`` or ``http://0.0.0.0:8000``  Then navigate to the ``index.html`` file in your web browser and click on the link.  You should now see a blank screen.

To begin, open up your main.js file.  In the following code below that you should copy and paste, we are going to load the other Javascript files and initialize the phaser window.

```javascript
// Load External Javascript files
const loadHeroScript = document.createElement('script');
loadHeroScript.src = './js/heroScript.js';
document.head.appendChild(loadHeroScript);

const loadLoadingState = document.createElement('script');
loadLoadingState.src = './js/loadingState.js';
document.head.appendChild(loadLoadingState);

const loadPlaystate = document.createElement('script');
loadPlaystate.src = './js/playState.js';
document.head.appendChild(loadPlaystate);

// =============================================================================
// Load the various phaser states and start game
// =============================================================================

window.addEventListener('load', () => {
  const game = new window.Phaser.Game(960, 600, window.Phaser.AUTO, 'game');
  game.state.disableVisibilityChange = true; // This allows two windows to be open at the same time and allow both windows to run the update function
  game.state.add('play', window.PlayState);
  game.state.add('loading', window.LoadingState);
  //window.createMyPubNub(0); // Connect to the PubNub network and run level code 0
  //window.StartLoading = function () {
    game.state.start('loading'); // Run the loading function once you successfully connect to the PubNub network
  //};
});
```
Now if you refresh your HTML window, you should see that the phaser window has been created.  It should be completely black since there are no assets loaded in the scene yet.  The ```Phaser.AUTO``` parameter is to specify whether we want a 2D canvas or a WebGL canvas.  In this case, we will use WebGL by default but will fall back to 2D if it's not supported.

## <a name="loadingstate"></a>loadingState.js

Now lets create the loading state to load the assets into the scene.  Open up your loadingState.js file and copy and paste the following code:

```javascript
'use strict';

// =============================================================================
// Loading state
// =============================================================================

window.LoadingState = { // Create an object with all of the loading information inside of it
  init() {
    // keep crispy-looking pixels
    this.game.renderer.renderSession.roundPixels = true; // Make the phaser sprites look smoother
  },

  preload() {
    this.game.stage.disableVisibilityChange = true;

    // Load JSON levels
    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.json('level:2', 'data/level02.json');


    this.game.load.image('font:numbers', 'images/numbers.png');
    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('background', 'images/bg.png');
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.image('key', 'images/key.png');

    this.game.load.spritesheet('decoration', 'images/decor.png', 42, 42);
    this.game.load.spritesheet('herodude', 'images/hero.png', 36, 42);
    this.game.load.spritesheet('hero', 'images/gameSmall.png', 36, 42);
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.audio('bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);
  },

  create() {
    this.game.state.start('play', true, false, { level: window.globalCurrentLevel }); // Start Game
  }
};
```

Now lets look at what this code is doing.  We created a object called ``window.LoadingState`` with all of the loading state information inside of it.  In the ``init()`` function, we made the sprite objects in the game look smoother by using the Phaser API ``this.game.renderer.renderSession.roundPixels = true;``  In the preload function, we load the JSON level information from the data folder.  This data information will be used to generate the levels.  Then every asset that we will use in the game needs to be preloaded into cache.  We also load the various spritesheets and even preload the audio (we won't be using audio in this tutorial, however you can easily add it by uncommenting out code).  Lastly we run the ``create()`` function that starts the game and loads whatever the ``window.globalCurrentLevel`` is.  Lets go set that variable in ``main.js``

## <a name="assets"></a>Display Assets on the Screen

Navigate to ``main.js`` and at the top of the document add the code: 
```javascript
window.syncOtherPlayerFrameDelay = 0; //30 frames allows for 500ms of network jitter, to prevent late frames
window.currentChannelName; // Global variable for the current channel that your player character is on
window.currentFireChannelName; // Global variable that checks the current stage you are on to send the correct information to the PubNub Block
window.globalCurrentLevel = 0; // Global variable for the current level (index starts at 0)
window.UniqueID = window.PubNub.generateUUID(); // Generate a unique id for the player. Generated by the PubNub Network
window.globalLevelState = null; // Sets the globalLevelState to null if you aren't connected to the network. Once connected, the level will generate to the info that was on the block.
window.globalWasHeroMoving = true;
// console.log('UniqueID', UniqueID); // Print out your clientsr Unique ID
window.text1 = 'Level 1 Occupancy: 0'; // Global text objects for occupancy count
window.text2 = 'Level 2 Occupancy: 0';
window.text3 = 'Level 3 Occupancy: 0';
let textResponse1;
let textResponse2;
let textResponse3;
window.updateOccupancyCounter = false; // Occupancy Counter variable to check if the timer has already been called in that scene
window.keyMessages = [];
```

This created a global variable necessary for the next part of the tutorial.  Now go to ``playState.js`` and instantiate the PlayState game state: 

```javascript
window.PlayState = {
	
}
```

Now inside of that object, add the first part of the code:

```javascript
  init(data) {
    this.keys = this.game.input.keyboard.addKeys({
      left: window.Phaser.KeyCode.LEFT,
      right: window.Phaser.KeyCode.RIGHT,
      up: window.Phaser.KeyCode.UP
    });
    this.coinPickupCount = 0;
    keyCollected = false;
    this.level = (data.level || 0);
  },
  create() {
    window.globalGameState = this;
    // fade in  (from black)
    this.camera.flash('#000000');
    // create sound entities
    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      key: this.game.add.audio('sfx:key'),
      stomp: this.game.add.audio('sfx:stomp'),
      door: this.game.add.audio('sfx:door')
    };
    // create level entities and decoration
    this.game.add.image(0, 0, 'background');
    window.textObject1 = this.game.add.text(700, 5, window.text1, { font: 'Bold 200px Arial', fill: '#000000', fontSize: '20px' });
    window.textObject2 = this.game.add.text(700, 35, window.text2, { font: 'Bold 200px Arial', fill: '#000000', fontSize: '20px' });
    window.textObject3 = this.game.add.text(700, 65, window.text3, { font: 'Bold 200px Arial', fill: '#000000', fontSize: '20px' });
    if (window.globalLevelState === null) {
      window.globalLevelState = {
        time: 0,
        coinCache: this.game.cache.getJSON(`level:0`)
      };
    }

    this._loadLevel(window.globalLevelState.coinCache);
    // this._loadLevel(window.globalLevelState.value);
    // create UI score boards
    this._createHud();
  },
```











