# Realtime Multiplayer Game with PubNub Tutorial #

## Table of Contents
* [Setup Your Machine](#setup)
* [Launch a Local Server](#launchserver)
* [Setting Up PubNub](#pubnub)
* [Initialize Phaser](#initialize)
* [Create loadingState.js](#loadingstate)
* [Display Assets on the Screen](#assets)
* [Create heroScript.js](#heroscript)
* [Player Movement](#playermovement)
* [Add Object Collisions](#objectcollisions)
* [Handle Messages](#handlemessages)
* [Adding PubNub](#addingpubnub)
* [Setup Your PubNub Dashboard](#setupdashboard)
* [Uncomment Code](#uncommentcode)
* [PubNub Functions to Manage Gamestate](#pubnubfunctions)

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
* Locations and Connected cars: Dispatching taxi cabs
* Smart sensors: Receiving data from a sensor for data visualizations
* Health: Monitoring heart rate from a patient's wearable device
* Multiplayer gaming
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
Download the project assets here: https://github.com/pubnub-dsn/Ninja-Multiplayer-Platformer/blob/master/Tutorial/ProjectAssets.zip

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
Now if you refresh your HTML window, you should see that the phaser window has been created.  It should be completely black since there are no assets loaded in the scene yet.  The ```window.Phaser.AUTO``` parameter is to specify whether we want a 2D canvas or a WebGL canvas.  In this case, we will use WebGL by default but will fall back to 2D if it's not supported.

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

This created global variables necessary for the next part of the tutorial.  Now go to ``playState.js`` and instantiate the PlayState game state and set up some variables: 

```javascript
const keyStates = {};
let keyCollected = false;
window.frameCounter = 0;

window.PlayState = {
	
}
```

Now inside of the ``window.PlayState`` object, add the first part of the code:

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
        coinCache: this.game.cache.getJSON(`level:${this.level}`)
      };
    }

    this._loadLevel(window.globalLevelState.coinCache);
    // this._loadLevel(window.globalLevelState.value);
    // create UI score boards
    this._createHud();
  },
```

Now lets look at each part of the code.  In the ``init(data)`` function, we set ``this.keys`` to be the command to detect which key on the keyboard has been pressed.  Since this is the initialize function in the play state, certain variables must be set for later use.

In the ``create() {}`` function, we set some more variables and also make the screen fade in upon loading the web page by using the Phaser API call ``this.camera.flash('#000000');``  

Then we setup our sound effect variables in the ``this.sfx`` object.  Currently in this tutorial, all of the sound effects are commented out, however you can easily go uncomment them later. 

 We then set the background image by calling the command ``this.game.add.image(0, 0, 'background');``  

Next we set the text objects that will be used to detect presence events in each room.  We have an if statement that checks to see if the ``window.globalLevelState`` is equal to null.  If it is equal, we set the coinCache equal to ``level:0`` since we want the scene to load the first level if it doesn't receive any information from the PubNub Block.  

We then call the ``_loadLevel()`` function and also the ``_createHud()`` function.

If we run this code as is, we will get errors since we are calling functions that we haven't created yet.  Let's add some more code inside of ``window.playState = {}`` and below the ``create(){}`` function:

```javascript
  _loadLevel(data) {
    // console.log(data)
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();

    // spawn hero and enemies
    this._spawnCharacters({ hero: data.hero, spiders: data.spiders });

    // spawn level decoration
    data.decoration.forEach(function (deco) {
      this.bgDecoration.add(
        this.game.add.image(deco.x, deco.y, 'decoration', deco.frame));
    }, this);

    // spawn platforms
    data.platforms.forEach(this._spawnPlatform, this);

    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);
    this._spawnKey(data.key.x, data.key.y);
    this._spawnDoor(data.door.x, data.door.y);

    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
  },
  _spawnPlatform(platform) {
    const sprite = this.platforms.create(platform.x, platform.y, platform.image);
    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
  },
  _spawnCoin(coin) {
    const sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    // physics (so we can detect overlap with the hero)
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    // animations
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
  },
  _addOtherCharacter(uuid) {
    // console.log('Added another character to game');
    if (window.globalOtherHeros.has(uuid)) { return; }
    // console.log('_addOtherCharacter', uuid);
    this.hero2 = new window.Hero(this.game, 10, 10);
    this.hero2.lastKeyFrame = 0;
    this.game.add.existing(this.hero2);
    window.globalOtherHeros.set(uuid, this.hero2);
  },
  _removeOtherCharacter(uuid) {
    if (!window.globalOtherHeros.has(uuid)) { return; }
    window.globalOtherHeros.get(uuid).destroy();
    window.globalOtherHeros.delete(uuid);
  },
  _spawnCharacters(data) {
    this.hero = new window.Hero(this.game, 10, 10);
    this.hero.body.bounce.setTo(0);
    const playerText = this.game.add.text(this.hero.position.x - 10, this.hero.position.y - 550, 'me', { fill: '#000000', fontSize: '15px' });
    playerText.anchor.set(0.5);
    this.hero.addChild(playerText);
    // console.log(playerText.position.x, playerText.position.y);
    window.globalMyHero = this.hero;
    window.globalOtherHeros = this.otherHeros = new Map();
    this.game.add.existing(this.hero);
    // globalMyHero.alpha = 1; //compensating for lag
    // window.sendKeyMessage({}); // UNCOMMENT LATER
  },
  _spawnKey(x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    // enable physics to detect collisions, so the hero can pick the key up
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    // add a small 'up & down' animation via a tween
    this.key.y -= 3;
    this.game.add.tween(this.key)
      .to({ y: this.key.y + 6 }, 800, window.Phaser.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .loop()
      .start();
  },

  _spawnDoor(x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
  },
  _createHud() {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);

    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);

    const coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    const coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
    this.hud.position.set(10, 10);
  },

```

Lets look at each section of the above code to see what it's doing.

``_loadLevel(data)`` creates asset groups that we are need later on in the code.  Then it spawns all of the level decorations (the mushrooms, grass etc) from the JSON file information that we stored into cache earlier in the code.  Next we spawn the animated coins, the key and the door into the level along with setting the gravity constant and turning on gravity.

``_spawnPlatform(platform)`` spawns each platform object and turns them into a sprite.  Then they are set to not be affected by gravity and also set to be immovable so other sprite objects can't impact their position.

``_spawnCoin(coin)`` creates each coin asset and places them on the screen, and adds their animations.

``_addOtherCharacter(uuid)`` adds a hero that is not your own to the screen when someone else connects to the same PubNub channel.

``_spawnCharacters(data)`` spawns the hero asset into the game.  The hero information is defined in ``heroScript.js`` that we are going to create in a bit.  We also set playerText to appear above your player so that way when we make the game multiplayer, you can tell who's apart.

``_spawnKey(x,y)`` creates the key that unlocks the door.  A tween is applied to give the key the animation effect.

``_spawnDoor(x,y)`` places the door in a set position.

``_createHud()`` creates the overlay at the top left of the screen that checks to see if you have collected the key for that level and also how many coins you have collected.

Keep in mind you will still get errors in the console since we haven't yet wrote the heroScript.js code.  Lets do that now.

### <a name="heroscript"></a> Hero Script

Open up your ``heroScript.js`` document and copy and paste the follow code then save: 

```javascript
'use strict';

// =============================================================================
// Create Player (Hero)
// =============================================================================
window.Hero = class Hero extends window.Phaser.Sprite {
  constructor(game) {
    super();
    window.Phaser.Sprite.call(this, game, 10, 523, 'hero');
    // anchor
    this.anchor.set(0.5, 0.5);
    // physics properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // animations
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    // starting animation
    this.animations.play('stop');
  }

  move(direction) {
    // guard
    if (this.isFrozen) { return; }
    const SPEED = 200;

    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
      this.scale.x = -1;
    } else if (this.body.velocity.x > 0) {
      this.scale.x = 1;
    }
  }

  jump() {
    // Hero jumping code
    const JUMP_SPEED = 600;
    const canJump = this.body.touching.down && this.alive && !this.isFrozen;
    // console.log({
    //   canJump: canJump,
    //   'this.body.touching.down': this.body.touching.down,
    //   'this.alive': this.alive,
    //   'this.isFrozen': this.isFrozen
    // });

    if (canJump || this.isBoosting) {
      this.body.velocity.y = -JUMP_SPEED;
      this.isBoosting = true;
    }
    return canJump;
  }

  update() {
    // update sprite animation, if it needs changing
    const animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
      this.animations.play(animationName);
    }
  }

  freeze() { // When player goes through door do animation and remove player
    this.body.enable = false;
    this.isFrozen = true;
  }

  // returns the animation name that should be playing depending on
  // current circumstances
  _getAnimationName() {
    let name = 'stop'; // default animation
    if (this.isFrozen) {
      name = 'stop';
    } else if (this.body.velocity.y < 0) {
      name = 'jump';
    } else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
      name = 'fall';
    } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
      name = 'run';
    }
    return name;
  }
};
```

``heroScript.js`` sets up the player animations and handles the player movement.  In the ``move(direction)`` function, we determine what direction the player should be facing depending upon the velocity of the player.  In ``jump()`` we set the properties to determine if the player can jump or not.  In ``update()`` we update the sprite animation only if it needs to be changed.  In ``freeze()`` we play the animate of the player going through the door.  In ``_getAnimationName()`` we set the various animation names depending upon the hero body's velocity.  

Now if you copy and pasted this code correctly, save your document then refresh your browser window.  You should see something like this: 

![Screenshot1](/readmepics/tutorialscreen1.png)


## <a name="playermovement"></a>Player Movement

Now we are going to add the code for the player movement to work.  Below the ``create() {}`` function in ``playState.js``, paste the following code:

```javascript
  update() {
    window.frameCounter++;
    this._handleCollisions();
    this._handleInput();
    // update scoreboards
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = keyCollected ? 1 : 0;
  },

  shutdown() {
    // this.bgm.stop();
  },

  _canHeroEnterDoor(hero) {
    return keyCollected && hero.body.touching.down;
  },
```

The ``update()`` function adds one to the frame count every frame.  This is used to sync the player movements across all devices without the need to send PubNub publishes every frame.  It also calls the ``_handleInput()`` and ``_handleCollisions()`` function every frame.  

The ``shutdown()`` function is used to stop the background music from playing if you so wish to enable it (for this tutorial sound effects are commented out).  

The ``_canHeroEnterDoor(hero)`` function checks to see if the key was collect and the hero is touching the platform object in order to enter through the door. 

Now lets add the ``_handleCollisions()`` function to the game.  Add this code right under the last code you just copy and pasted:

```javascript
 _handleCollisions() {
    for (let i = 0; i < 2; i++) { // prevent collisions for pushing thru
      this.game.physics.arcade.collide(this.hero, this.platforms);
      for (const uuid of window.globalOtherHeros.keys()) {
        const otherplayer = window.globalOtherHeros.get(uuid);
        this.game.physics.arcade.collide(otherplayer, this.platforms, null, null, this);
        this.game.physics.arcade.overlap(otherplayer, this.coins, this._onHeroVsCoin, null, this);
        this.game.physics.arcade.overlap(otherplayer, this.key, this._onHeroVsKey, null, this);
        this.game.physics.arcade.overlap(otherplayer, this.door, this._onOtherHeroVsDoor, this._canHeroEnterDoor, this);
      }
      // hero vs coins (pick up)
      this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
      // hero vs key (pick up)
      this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey, null, this);
      // hero vs door (end level)
      this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor, this._canHeroEnterDoor, this);
      // ignore if there is no key or the player is on air
    }
  },
```

The ``_handleCollisions()`` function handles all of the scenes object collision events.  For instance if the hero collides with a key, it will run the ``this._onHeroVsKey`` function.  

Now lets add the ``_handleInput()`` function.  Code is commented out here until we add the PubNub portion.  Then we will go back and uncomment the code to send key event messages to the PubNub network.  Add this code under the ``_handleCollisions()`` function:

```javascript
  _handleInput() {
    // handleKeyMessages(); // UNCOMMENT LATER
    //  logCurrentState(this.game);
    if (this.hero) { // Added this so we can control spawning of heros
      if (this.keys.left.isDown) {
        if (!keyStates.leftIsDown) {
          // console.log('left pushed');
          // window.sendKeyMessage({ left: 'down' });  // UNCOMMENT LATER
        }
        keyStates.leftIsDown = true;
      } else {
        if (keyStates.leftIsDown) {
          // console.log('left un-pushed');
          // window.sendKeyMessage({ left: 'up' }); // UNCOMMENT LATER
        }
        keyStates.leftIsDown = false;
      }

      if (this.keys.right.isDown) {
        if (!keyStates.rightIsDown) {
          // console.log('right pushed');
          // window.sendKeyMessage({ right: 'down' }); // UNCOMMENT LATER
        }
        keyStates.rightIsDown = true;
      } else {
        if (keyStates.rightIsDown) {
          // console.log('right un-pushed');
          // window.sendKeyMessage({ right: 'up' }); // UNCOMMENT LATER
        }
        keyStates.rightIsDown = false;
      }

      if (this.hero.body.touching.down) {
        if (this.keys.up.isDown) {
          if (!keyStates.upIsDown) {
            // window.sendKeyMessage({ up: 'down' }); // UNCOMMENT LATER
            window.globalMyHero.jump();
          }
          keyStates.upIsDown = true;
        } else {
          if (keyStates.upIsDown) {
            // console.log('up un-pushed');
            // window.sendKeyMessage({ up: 'up' }); // UNCOMMENT LATER
          }
          keyStates.upIsDown = false;
        }
      }

      if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
      } else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
      } else { // stop
        this.hero.move(0);
      }

      // handle jump
      const JUMP_HOLD = 10;// 200; // ms
      if (this.keys.up.downDuration(JUMP_HOLD)) {
        // let didJump = this.hero.jump();
        // if (didJump) { this.sfx.jump.play();}
      }

      for (const uuid of window.globalOtherHeros.keys()) {
        const otherplayer = window.globalOtherHeros.get(uuid);
        if (Date.now() + JUMP_HOLD <= otherplayer.jumpStart) {
          // otherplayer.jump();
        }
        if (otherplayer.goingLeft) { // move hero left
          otherplayer.move(-1);
        } else if (otherplayer.goingRight) { // move hero right
          otherplayer.move(1);
        } else { // stop
          otherplayer.move(0);
        }
      }
    }

    if (window.globalWasHeroMoving && this.hero.body.velocity.x === 0 && this.hero.body.velocity.y === 0 && this.hero.body.touching.down) {
      // window.sendKeyMessage({ stopped: 'not moving' }); // UNCOMMENT LATER
      console.log('stopped');
      window.globalWasHeroMoving = false;
    } else if (window.globalWasHeroMoving || this.hero.body.velocity.x !== 0 || this.hero.body.velocity.y !== 0 || !this.hero.body.touching.down) {
      window.globalWasHeroMoving = true;
    }
  },
```

The ``_handleInput()`` function runs every frame and checks to see if your hero object exists on the screen.  If it does, it checks every frame to see if any of the keys have been pressed down.  If it has been pressed down, send a message that the button pressed is up.  This is a basic boolean if statement.  

The next part of the code actually moves the character by calling ``this.hero.move(-1)``, ``this.hero.move(1)`` or ``this.hero.move(0)``.  That calls the move function in ``heroScript.js``.  

The next portion of the code is going to be used later on in the tutorial, but is there to check to see which UUID matches with what player object on the screen.  If there is a match, it moves the players based off what messages it's receiving from the PubNub callback which we are going to code later on in this tutorial.

In the next portion, of code we check to see if the player has stopped moving entirely.  If they have we send out a message to everyone declaring that they are standing still.

When you save all of your documents and refresh your web browser, you should see this screen and should be able to move your character around using the <b>left, right and up arrows</b>.  Try it out: 


![Screenshot2](/readmepics/tutorialscreen2.png)



## <a name="objectcollisions"></a>Add Object Collisions

Now lets add the functions that allow the players on the screen to interact with the objects on screen.  Each function is a function that is called when that specific collision event occurs.  Most of the logic here is simply animations.  The ``_goToNextLevel()`` function loads the next level and if the level is equal to the last level, it will restart you at the first level. Copy and past this code below the ``_handleInput()`` function: 

```javascript
  _onHeroVsKey(hero, key) {
    // this.sfx.key.play();
    this.door.frame = 1;
    key.kill();
    keyCollected = true;
    window.sendKeyMessage({ keyCollected });
  },

  _onHeroVsCoin(hero, coin) {
    // this.sfx.coin.play();
    coin.kill();
    logCurrentStateCoin(this.game, coin);
    this.coinPickupCount++;
  },

  _onHeroVsDoor(hero, door) {
      // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
      // this.sfx.door.play();
      // play 'enter door' animation and change to the next level when it ends
    hero.freeze();
    this.game.add.tween(hero)
      .to({ x: this.door.x, alpha: 0 }, 0, null, true)
      .onComplete.addOnce(this._goToNextLevel, this);
  },

  _onOtherHeroVsDoor(hero, door) {
    // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
    // this.sfx.door.play();
    // play 'enter door' animation and change to the next level when it ends
    hero.freeze();
    this.game.add.tween(hero)
      .to({ x: this.door.x, alpha: 0 }, 500, null, true);
  },
  _goToNextLevel() {
    this.camera.fade('#000000');
    this.camera.onFadeComplete.addOnce(function () {
      window.globalUnsubscribe();
      window.updateOccupancyCounter = false;
      if (this.level === 2) {
        window.createMyPubNub(0);
      } else {
        window.createMyPubNub(this.level + 1);
      }
    }, this);
  },
```

If you refresh the window, you will get an error since we haven't defined ``logCurrentStateCoin`` yet.  Go to the top of ``playState.js`` and add the following code right below the ``window.frameCounter`` variable:

```javascript
function logCurrentStateCoin(game, coin) {
  // Log Current Game State of Collected Coins
  for (const value of window.globalLevelState.coinCache.coins) {
    if (coin.x === value.x) {
      window.globalLevelState.coinCache.coins.splice(window.globalLevelState.coinCache.coins.indexOf(value), 1);
      // console.log(value)
    }
  }
  window.fireCoins();
  // console.log(window.globalLevelState.coinCache.coins)
}
```

When you copy and paste that code, you will still get an error since ``window.fireCoins()`` is a function that has not yet been defined.  Go ahead and comment out that line of code by using the ``//`` tags in front of the statement.  Now refresh your window and you should be able to move your player around and collect the coins without trouble.  However if you try to collect the key, you will get an error since we have not yet defined the ``sendKeyMessage()`` function.

![Screenshot3](/readmepics/tutorialscreen3.png)

## <a name="handlemessages"></a>Handle Messages

Now lets add the ``handleKeyMessages()`` function to the game so we can start implementing the multiplayer components.  This function handles all of the messages that get received by the client.  Essentially what it's doing is syncing all the clients up to each other so the movements are accurately displayed on the screen.  Copy and paste this code in ``playState.js`` right below the ``logCurrentStateCoin(game, coin)`` function:

```javascript
function handleKeyMessages() {
  const earlyMessages = [];
  const lateMessages = [];
  window.keyMessages.forEach((messageEvent) => {
    if (window.globalOtherHeros) { // If player exists
      if (messageEvent.channel === window.currentChannelName) { // If the messages channel is equal to your current channel
        if (!window.globalOtherHeros.has(messageEvent.message.uuid)) { // If the message isn't equal to your uuid
          window.globalGameState._addOtherCharacter(messageEvent.message.uuid); // Add another player to the game that is not yourself

          const otherplayer = window.globalOtherHeros.get(messageEvent.message.uuid);
          otherplayer.position.set(messageEvent.message.position.x, messageEvent.message.position.y); // set the position of each player according to x y
          otherplayer.initialRemoteFrame = messageEvent.message.frameCounter;
          otherplayer.initialLocalFrame = window.frameCounter;
          window.sendKeyMessage({}); // Send publish to all clients about user information
        }
        if (messageEvent.message.position && window.globalOtherHeros.has(messageEvent.message.uuid)) { // If the message contains the position of the player and the player has a uuid that matches with one in the level
          window.keyMessages.push(messageEvent);
          const otherplayer = window.globalOtherHeros.get(messageEvent.message.uuid);
          const frameDelta = messageEvent.message.frameCounter - otherplayer.lastKeyFrame;
          const initDelta = otherplayer.initialRemoteFrame - otherplayer.initialLocalFrame;
          const frameDelay = (messageEvent.message.frameCounter - window.frameCounter) - initDelta + window.syncOtherPlayerFrameDelay;

          /*console.log({
            lastKeyFrame: otherplayer.lastKeyFrame,
            frameCounter: messageEvent.message.frameCounter,
            frameDelta,
            rf_lf: otherplayer.initialRemoteFrame - otherplayer.initialLocalFrame,
            frameDelay
          });*/

          if (frameDelay > 0) {
            if (!messageEvent.hasOwnProperty('frameDelay')) {
              messageEvent.frameDelay = frameDelay;
              otherplayer.totalRecvedFrameDelay += frameDelay;
              otherplayer.totalRecvedFrames++;
            //console.log('avgFrameDelay', otherplayer.totalRecvedFrameDelay / otherplayer.totalRecvedFrames);
            }
            earlyMessages.push(messageEvent);
            //console.log('initDelta', initDelta, 'early', frameDelay);
            //console.log('early', frameDelay);
            return;
          } else if (messageEvent.message.keyMessage.stopped === 'not moving') {
            console.log('initDelta', initDelta, 'stopping player');
            otherplayer.body.position.set(messageEvent.message.position.x, messageEvent.message.position.y);
            otherplayer.body.velocity.set(0, 0);
            otherplayer.goingLeft = false;
            otherplayer.goingRight = false;
            if (otherplayer.totalRecvedFrames > 0) {
              const avgFrameDelay = otherplayer.totalRecvedFrameDelay / otherplayer.totalRecvedFrames;
              const floorFrameDelay = Math.floor(avgFrameDelay);
            //console.log('otherplayer.initialRemoteFrame before', otherplayer.initialRemoteFrame);
              otherplayer.initialRemoteFrame += floorFrameDelay - 7;
            //console.log('otherplayer.initialRemoteFrame after', otherplayer.initialRemoteFrame);
              console.log('avg frame delay', avgFrameDelay, 'adjusting delta', floorFrameDelay);
            }
            otherplayer.totalRecvedFrameDelay = 0;
            otherplayer.totalRecvedFrames = 0;
          } else if (frameDelay < 0) {
            otherplayer.totalRecvedFrameDelay += frameDelay;
            otherplayer.totalRecvedFrames++;
            lateMessages.push(messageEvent);
            console.log('initDelta', initDelta, 'late', frameDelay);
            return;
          } else {
          //console.log('initDelta', initDelta, 'ontime', frameDelay);
          }

          otherplayer.lastKeyFrame = messageEvent.message.frameCounter;

          if (messageEvent.message.keyMessage.up === 'down') { // If message equals arrow up, make the player jump with the correct UUID
            otherplayer.jump();
            otherplayer.jumpStart = Date.now();
          } else if (messageEvent.message.keyMessage.up === 'up') {
            otherplayer.jumpStart = 0;
          }
          if (messageEvent.message.keyMessage.left === 'down') { // If message equals arrow left, make the player move left with the correct UUID
            otherplayer.goingLeft = true;
          } else if (messageEvent.message.keyMessage.left === 'up') {
            otherplayer.goingLeft = false;
          }
          if (messageEvent.message.keyMessage.right === 'down') { // If message equals arrow down, make the player move right with the correct UUID
            otherplayer.goingRight = true;
          } else if (messageEvent.message.keyMessage.right === 'up') {
            otherplayer.goingRight = false;
          }
        }
      }
    }
  });

  if (lateMessages.length > 0) {
  //console.log({ lateMessages, earlyMessages });
  }
  window.keyMessages.length = 0;
  earlyMessages.forEach((em) => {
    window.keyMessages.push(em);
  });
}
```

This function handles all messages coming from other clients that are connected to the game.  The function won't do anything right now until we add the multiplayer components to the game.  However lets take a quick look at what this function is doing.  We start out by taking the message data and checking to see if the message is equal to the current channel you are subscribed too and if you aren't the one sending the message.  If you receive a message from someone who is not in the game, create a new player and set their position.  We then send a message to update all clients about their new player position.  The ``handleKeyMessages()`` function also checks frame count to make sure all clients are in sync.  Also we check the ``messageEvent.message.keyMessage`` for the input events of all other users and will update their players state on all clients.

## <a name="addingpubnub"></a>Adding PubNub

Now we are going to add the PubNub portion of the code into the game to allow other players to join the game.  In your ``main.js`` file, add this section of code after the variables you set up and above the javascript files you loaded into the scene:

```javascript
window.createMyPubNub = function (currentLevel) {
  // console.log('createMyPubNub', currentLevel);
  window.globalCurrentLevel = currentLevel; // Get the current level and set it to the global level
  window.currentFireChannelName = 'realtimephaserFire2';
  window.currentChannelName = `realtimephaser${currentLevel}`; // Create the channel name + the current level. This way each level is on its own channel.
  let checkIfJoined = false; // If player has joined the channel

  // Setup your PubNub Keys
  window.pubnub = new window.PubNub({
    publishKey: 'ADD-YOUR-PUBNUB-PUBKEY-HERE',
    subscribeKey: 'ADD-YOUR-PUBNUB-SUBKEY-HERE',
    uuid: window.UniqueID,
  });

  // Subscribe to the two PubNub Channels
  window.pubnub.subscribe({
    channels: [window.currentChannelName, window.currentFireChannelName],
    withPresence: true,
  });

  // ADD LISTENER HERE

  // If person leaves or refreshes the window, run the unsubscribe function
  window.addEventListener('beforeunload', () => {
    navigator.sendBeacon(`https://pubsub.pubnub.com/v2/presence/sub_key/mySubKey/channel/ch1/leave?uuid=${window.UniqueID}`); // pub
    window.globalUnsubscribe();
  });

  // Unsubscribe people from PubNub network
  window.globalUnsubscribe = function () {
    try {
      // console.log('unsubscribing', window.currentChannelName);
      window.pubnub.unsubscribe({
        channels: [window.currentChannelName, window.currentFireChannelName],
        withPresence: true
      });
      window.pubnub.removeListener(window.listener);
    } catch (err) {
      // console.log("Failed to UnSub");
    }
  };
  window.pubnub.addListener(window.listener);
};
```

This function sets up some variables and channel names that PubNub is going to use for network communication.  We set ``window.currentChannelName`` to equal whatever current level the user is on.  We then setup the PubNub keys and subscribe to the channels specified.  Then we add a listener that when the browser is unloaded, it sends a beacon that a user has left the channel so the presence event updates for all other clients.  We also have a globalUnsubscribe function that removes the listener for the client and subscribes them from the channel.

### Setup Your PubNub Dashboard

Take a look at your publish and subscribe key.  You will need to add your own Publish and Subscribe keys in order for the game to work. Now if you haven't already, to get you setup with PubNub, navigate to the PubNub Website and create an account with your Google login. Once you are in the dashboard, name your application whatever you wish, and click the Create New App button. Once you create the application, click on the application to few the key information. You should see that you have two keys, a Publish Key, and a Subscribe Key. Click on the demo keyset, and it should load up a page that shows your keys in addition to Application Add-Ons. In the Application Add-Ons section, turn ON Presence and check Generate Leave on TCP FIN or RST and Global Here Now. Also turn ON PubNub Blocks. Make sure to have access manager turned off or else the sample code won't work since you need to include a secret key.

The code you have written so far still won't work since we haven't added the callback listener that will listen for all messages sent through the PubNub network on your channel while the client is connected.  Let's add the following code where the comment says ADD LISTENER HERE:

```javascript
  // Create PubNub Listener for message events
  window.listener = {
    status() {
      // Send fire event to connect to the block
      const requestIntMsg = { requestInt: true, currentLevel: window.globalCurrentLevel, uuid: window.UniqueID };
      window.pubnub.fire({
        message: requestIntMsg,
        channel: window.currentFireChannelName,
        sendByPost: false
      });
    },

    message(messageEvent) {
      if (messageEvent.message.uuid === window.UniqueID) {
        return; // this blocks drawing a new character set by the server, to lower latency
      }
      if (messageEvent.channel === window.currentFireChannelName) {
        window.globalLastTime = messageEvent.timetoken; // Set the timestamp for when you send fire messages to the block
        if (messageEvent.message.int === true && messageEvent.message.sendToRightPlayer === window.UniqueID) { // If you get a message and it matches with your UUID
          window.globalLevelState = messageEvent.message.value; // Set the globalLevelState to the information set on the block
          window.StartLoading(); // Call the game state start function in onLoad
        }
      }
      if (window.globalOtherHeros) { // If player exists
        if (messageEvent.channel === window.currentChannelName) { // If the messages channel is equal to your current channel
          if (!window.globalOtherHeros.has(messageEvent.message.uuid)) { // If the message isn't equal to your uuid
            window.globalGameState._addOtherCharacter(messageEvent.message.uuid); // Add another player to the game that is not yourself
            window.sendKeyMessage({}); // Send publish to all clients about user information
            const otherplayer = window.globalOtherHeros.get(messageEvent.message.uuid);
            otherplayer.position.set(messageEvent.message.position.x, messageEvent.message.position.y); // set the position of each player according to x y
            otherplayer.initialRemoteFrame = messageEvent.message.frameCounter;
            otherplayer.initialLocalFrame = window.frameCounter;
            otherplayer.totalRecvedFrameDelay = 0;
            otherplayer.totalRecvedFrames = 0;
          }
          if (messageEvent.message.position && window.globalOtherHeros.has(messageEvent.message.uuid)) { // If the message contains the position of the player and the player has a uuid that matches with one in the level
            window.keyMessages.push(messageEvent);
          }
        }
      }
    },

    presence(presenceEvent) { // PubNub on presence message / event
      let occupancyCounter;

      function checkFlag() {  // Function that reruns until response
        if (window.globalOtherHeros && checkIfJoined === true) { // If the globalother heros exists and if the player joined equals true
          clearInterval(occupancyCounter); // Destroy the timer for that scene
          window.updateOccupancyCounter = true; // Update the variable that stops the timer from running
          // Run PubNub HereNow function that controls the occupancy
          window.pubnub.hereNow(
            {
              includeUUIDs: true,
              includeState: true
            },
            (status, response) => {
              // If I get a valid response from the channel change the text objects to the correct occupancy count
              if (typeof (response.channels.realtimephaser0) !== 'undefined') {
                textResponse1 = response.channels.realtimephaser0.occupancy.toString();
              } else {
                textResponse1 = '0';
              }
              if (typeof (response.channels.realtimephaser1) !== 'undefined') {
                textResponse2 = response.channels.realtimephaser1.occupancy.toString();
              } else {
                textResponse2 = '0';
              }
              if (typeof (response.channels.realtimephaser2) !== 'undefined') {
                textResponse3 = response.channels.realtimephaser2.occupancy.toString();
              } else {
                textResponse3 = '0';
              }
              window.text1 = `Level 1 Occupancy: ${textResponse1}`;
              window.text2 = `Level 2 Occupancy: ${textResponse2}`;
              window.text3 = `Level 3 Occupancy: ${textResponse3}`;
              window.textObject1.setText(window.text1);
              window.textObject2.setText(window.text2);
              window.textObject3.setText(window.text3);
            }
          );
        }
      }

      if (window.updateOccupancyCounter === false) {
        occupancyCounter = setInterval(checkFlag, 200); // Start timer to run the checkflag function above
      }

      if (presenceEvent.action === 'join') { // If we receive a presence event that says a player joined the channel from the PubNub servers
        checkIfJoined = true;
        checkFlag();
        // text = presenceEvent.totalOccupancy.toString()
        if (presenceEvent.uuid !== window.UniqueID) {
          window.sendKeyMessage({}); // Send message of players location on screen
        }
      } else if (presenceEvent.action === 'leave' || presenceEvent.action === 'timeout') {
        checkFlag();
        try {
          window.globalGameState._removeOtherCharacter(presenceEvent.uuid); // Remove character on leave events if the individual exists
        } catch (err) {
          // console.log(err)
        }
      }
    }
  };
```

Now lets go through this code to look at what it's doing.  The listener is listening for events every frame but will only run on the initial connection status to PubNub, or when a message is sent on the channel or when a presence change occurs.  

In the ``status(status)`` callback, it's sending a fire message to the block to request level information from the KV store.  

In the ``message(messageEvent)`` callback function, we check to see if the message channel name is equal to the current fire channel name, if it is call the start loading function to load the game.  Then after that if statement, we check to see if the message channel is equal to the ``window.currentChannelName``.  If it is equal and it's not a message from yourself, add another player to the game and set its position in the correct location based off the message data.  

In the ``presence(presenceEvent)`` callback function, we have a function that runs if someone joins, leaves or timeouts of the channel, or if ``window.updateOccupancyCounter`` is equal to false.  We then run PubNub's hereNow API function that checks to see how many people are in the channel and outputs the current occupancy along with the UUID's in the channel.  We are only checking the amount of players in the channel when a presence event is called which is optimized compared to calling the function every frame.

Now right below that function we just wrote but above the load external javascript files code, copy and paste these last two functions.  One will send messages out to all clients connected to the channel.  The message will contain player UUID information, position and frame count.  The second function will send a message to the block telling it the current cache state of the user.

```javascript
window.sendKeyMessage = (keyMessage) => {
  try {
    if (window.globalMyHero) {
      window.pubnub.publish({
        message: {
          uuid: window.UniqueID,
          keyMessage,
          position: window.globalMyHero.body.position,
          frameCounter: window.frameCounter
        },
        channel: window.currentChannelName,
        sendByPost: false, // true to send via posts
      });
    }
      // console.log("send message!")
  } catch (err) {
    console.log(err);
  }
};

window.fireCoins = () => {
  const message = {
    uuid: window.UniqueID,
    coinCache: window.globalLevelState.coinCache,
    currentLevel: window.globalCurrentLevel,
    time: window.globalLastTime
  };
  // console.log('fireCoins', message);
  window.pubnub.fire(
    {
      message,
      channel: window.currentFireChannelName,
      sendByPost: false, // true to send via posts
    });
};
```

## <a name="uncommentcode"></a>Uncomment code

Now in order to make the function work, we have to go uncomment some code we left commented out before.  Go to the bottom of ``main.js`` where the event listener loads the scene.  Uncomment

```javascript
window.createMyPubNub(0); // Connect to the PubNub network and run level code 0
window.StartLoading = function () {
	game.state.start('loading'); // Run the loading function once you successfully connect to the PubNub network
};
```

Now go to ``playState.js`` uncomment ``window.fireCoins();`` in the ``logCurrentStateCoin()`` function.  Now go down to the ``_handleInput()`` function and uncomment:

```javascript
handleKeyMessages();
...
window.sendKeyMessage({ left: 'down' });
...
window.sendKeyMessage({ left: 'up' });
...
window.sendKeyMessage({ right: 'down' });
...
window.sendKeyMessage({ right: 'up' });
...
window.sendKeyMessage({ up: 'down' });
...
window.sendKeyMessage({ up: 'up' });
...
window.sendKeyMessage({ stopped: 'not moving' });
```

Then in the ``_spawnCharacters()`` function uncomment: 

```javascript
window.sendKeyMessage({});
```

Now save your files and refresh your window.  If you open up two separate windows of the game, you should be able to move your character on one window and see the character move on the other window with very low latency.  This is all powered by PubNub's real time network and API.

## <a name="pubnubfunctions"></a>PubNub Functions to Manage Game State

You will notice that if you collect a coin in one window, then open up another window, all the coins will show up for the new player that joined but there will be coins missing on the other players screen.  We can prevent this from happening by using a PubNub Function.  Make sure to go uncomment ``window.fireCoins()`` that you commented earlier in the ``logCurrentStateCoin`` function.

Then go to http://pubnub.com and login to your dashboard.  Once loaded, click on your application then on the left hand bar, click the Functions box.  Click the Create Module button and name it whatever you wish.  Then create a new Function and call it whatever you wish. Make sure you select <b>Before Publish or Fire</b> and the channel name is <b>realtimephaserFire2</b>. 

Now copy and paste the following code into the portal:

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

This code saves the game state in the PubNub Function.  The information saved is the contents of the JSON level information.  Essentially if JSON information exists in the Function, publish that information to the newly connected user.  If there is no information, use whatever JSON information is local on the client.  Also the only time the JSON updates in the PubNub Function is when a coin is collected in the scene by any player.  

Now click the <b>+</b> button in the PubNub Functions dashboard and create a new function and name it onLeave except call it only <b>After Presence</b> and on the channel <b>realtimephaserFire2</b>.  Now copy and paste the following code:

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

This PubNub Function will only run when someone joins, leaves or timeouts of a channel.  If the total occupancy of the game equals zero, it resets the current level cache to nothing so the coins will appear for anyone new that joins the game.





