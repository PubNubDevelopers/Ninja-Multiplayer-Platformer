//PubNub


window.currentChannelName;
window.currentFireChannelName;
window.globalCurrentLevel = 0;
window.UniqueID = PubNub.generateUUID();
window.globalLevelState = null;
console.log('UniqueID', UniqueID);


window.createMyPubNub = function(currentLevel) {
    console.log('createMyPubNub', currentLevel);
    window.globalCurrentLevel = currentLevel;
	window.currentChannelName = 'realtimephaser' + currentLevel;
	window.currentFireChannelName = 'realtimephaserFire2';
	try {
//window.globalUnsubscribe();
	}
	catch(err){}

window.pubnub = new PubNub({
    publishKey : 'pub-c-1c688f67-2435-4622-96e3-d30dfd9d0b37',
    subscribeKey : 'sub-c-e4c02264-1e13-11e7-894d-0619f8945a4f',
    uuid: UniqueID,
});

pubnub.subscribe({
    channels : [window.currentChannelName, window.currentFireChannelName],
    withPresence: true,
});


window.listener = {
    status: function(statusEvent) {
        //console.log('status', statusEvent);

        var requestIntMsg = {requestInt: true, currentLevel: window.globalCurrentLevel, uuid: UniqueID};
        //console.log('requestIntMsg', requestIntMsg);
            pubnub.fire(
    {
        message: requestIntMsg,
        
        channel: window.currentFireChannelName,
        sendByPost: false, // true to send via posts
    });


/*

 This right here is to associate the current level with the UUID on the server, so the server know what level this player is on

    pubnub.setState(
    {
        state: {currentLevel: currentLevel},
        channels: [window.currentChannelName, window.currentFireChannelName]
    },
    function (status, response) {
        // handle status, response
    }
    );
*/

		/*document.getElementById('sendMessage').onclick = (function(){
			console.log('clicked');
         pubnub.publish(
            {
                message: { 
                    uuid: UniqueID,
					buttonPushed: 'sendMessage'
                },
                channel: window.currentChannelName,
                sendByPost: false, // true to send via posts
            });					
		});*/

    },
    message: function(message) {
    	if(message.message.uuid === UniqueID) {
    	    return; //this blocks drawing a new character set by the server for ourselve, to lower latency
    	}
        if(message.channel === window.currentFireChannelName) {
            window.globalLastTime = message.timetoken;
            //console.log('timetoken is ', message.timetoken);
            if(message.message.int === true && message.message.sendToRightPlayer === UniqueID) {
                window.globalLevelState = message.message.value;
                //console.log('window.globalLevelState', window.globalLevelState);
                    //console.log('finish loading...');
                    window.StartLoading();
                    //console.log("join", data)
				    //sendKeyMessage({});

            }

        }
        if(window.globalOtherHeros) {
            if(message.channel === window.currentChannelName) {
                //console.log("message",message)
                if(!window.globalOtherHeros.has(message.message.uuid)) {
                    window.globalGameState._addOtherCharacter(message.message.uuid);
                }
                //console.log(message.message.uuid, message.message.position);
                if(message.message.position && window.globalOtherHeros.has(message.message.uuid)) {
                    var otherplayer = window.globalOtherHeros.get(message.message.uuid);
                    //console.log('has otherplayer', otherplayer);
                    otherplayer.position.set(message.message.position.x, message.message.position.y);
                //otherplayer.body.velocity.set(message.message.velocity.x, message.message.velocity.y);
                    if(message.message.keyMessage.up === 'down') {
                        otherplayer.jump();
                        otherplayer.jumpStart = Date.now();
                    }	else	if(message.message.keyMessage.up === 'up') {
                        otherplayer.jumpStart = 0;
                    }
                    if(message.message.keyMessage.left === 'down') {
                        otherplayer.goingLeft = true;
                    }	else	if(message.message.keyMessage.left === 'up') {
                        otherplayer.goingLeft = false;
                    }
                    if(message.message.keyMessage.right === 'down') {
                        otherplayer.goingRight = true;
                    }	else	if(message.message.keyMessage.right === 'up') {
                        otherplayer.goingRight = false;
                    }
                    if (message.message.death === true){
                        //console.log(message.message.death)

                        //otherplayer.events.onKilled.addOnce(function () {
                            //this.game.state.restart(true, false, {level: this.level});
                        //}, this);
                    }
                }
            }
        }
    },
    presence: function(presenceEvent, data) {
        //console.log(presenceEvent)
        if (presenceEvent.action === 'join')
        {

            if(presenceEvent.uuid != UniqueID){
                sendKeyMessage({});
                /* pubnub.publish(
                    {
                        message: { 
                            uuid: UniqueID,
														existant: true
                        },
                        channel: window.currentChannelName,
                        sendByPost: false, // true to send via posts
                    });*/
				//window.globalGameState._addOtherCharacter(presenceEvent.uuid);

            } else {// My uuid joined
                if(presenceEvent.channel === window.currentFireChannelName) {
                }                
            }
           // console.log("join")
                //this.hero = new Hero(this.game, 100, 100);
                //this.game.add.existing(this.hero);
        }
        else if(presenceEvent.action === 'leave' || presenceEvent.action === 'timeout') 
        {
            try {
	       window.globalGameState._removeOtherCharacter(presenceEvent.uuid);
            } catch(err) {

            }
        }
    }

}


//If person leaves or refreshes the window, run the unsubscribe function
window.onbeforeunload = function(e) {
    window.globalUnsubscribe();
};
//Unscribe people from PubNub network
window.globalUnsubscribe = function(uuid) {
	try {
    console.log('unsubscribing', window.currentChannelName);
    pubnub.unsubscribe({
        channels: [window.currentChannelName, window.currentFireChannelName],
        withPresence: true
    });
    pubnub.removeListener(listener);
	} catch(err) {
		console.log("Failed to UnSub");
	}
}
pubnub.addListener(listener);

}

// =============================================================================
// Sprites
// =============================================================================

//
// Hero
//


function Hero(game, x, y) {
    // call Phaser.Sprite constructor
   // var dank = Math.floor(Math.random() * 2); 
    //if(dank === 1){
        Phaser.Sprite.call(this, game, x, y, 'hero');
    //}else{Phaser.Sprite.call(this, game, x, y, 'herodude');}

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
    this.animations.add('die', [5, 6, 5, 6, 5, 6, 5, 6], 12); // 12fps no loop
    // starting animation
    this.animations.play('stop');
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    // guard
    if (this.isFrozen) { return; }

    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down && this.alive && !this.isFrozen;

    if (canJump || this.isBoosting) {
        this.body.velocity.y = -JUMP_SPEED;
        this.isBoosting = true;
    }

    return canJump;
};

Hero.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 200;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Hero.prototype.freeze = function () {
    this.body.enable = false;
    this.isFrozen = true;
};

Hero.prototype.die = function () {
    this.alive = false;
    this.body.enable = false;
    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
        //console.log("die")
    }, this);
};

// returns the animation name that should be playing depending on
// current circumstances
Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // dying
    if (!this.alive) {
        name = 'die';
    }
    // frozen & not dying
    else if (this.isFrozen) {
        name = 'stop';
    }
    // jumping
    else if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

//
// Spider (enemy)
//

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 100;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// =============================================================================
// Loading state
// =============================================================================

LoadingState = {};

LoadingState.init = function () {
    // keep crispy-looking pixels
    this.game.renderer.renderSession.roundPixels = true;
};

LoadingState.preload = function () {
    this.game.stage.disableVisibilityChange = true;
    //console.log('preload');

    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.json('level:1', 'data/level01.json');

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
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.audio('bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);
};

LoadingState.create = function () {

    this.game.state.start('play', true, false, {level: window.globalCurrentLevel});
};

// =============================================================================
// Play state
// =============================================================================

PlayState = {};

const LEVEL_COUNT = 2;
var keyCollected = false;

PlayState.init = function (data) {
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

		
    this.coinPickupCount = 0;
    keyCollected = false;
    this.level = (data.level || 0) % LEVEL_COUNT;
};

PlayState.create = function () {
		window.globalGameState = this;
		//console.log('window.globalGameState created' , this.level);



    // fade in  (from black)
    this.camera.flash('#000000');

    // create sound entities
    /*this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        key: this.game.add.audio('sfx:key'),
        stomp: this.game.add.audio('sfx:stomp'),
        door: this.game.add.audio('sfx:door')
    };
    this.bgm = this.game.add.audio('bgm');
    this.bgm.loopFull();*/

    // create level entities and decoration
    this.game.add.image(0, 0, 'background');
   if(window.globalLevelState === null) {
       window.globalLevelState = {
           time: 0,
           coinCache: this.game.cache.getJSON(`level:${this.level}`)
       };
   }
    this._loadLevel(window.globalLevelState.coinCache);
    //this._loadLevel(window.globalLevelState.value);
    
   
    // create UI score boards
    this._createHud();
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();

    // update scoreboards
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = keyCollected ? 1 : 0;
};

PlayState.shutdown = function () {
    //this.bgm.stop();
};


PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);
		for(let uuid of globalOtherHeros.keys()) {
			var otherplayer = globalOtherHeros.get(uuid);
			this.game.physics.arcade.collide(otherplayer, this.platforms);
			this.game.physics.arcade.overlap(otherplayer, this.coins, this._onHeroVsCoin, null, this);
            this.game.physics.arcade.overlap(otherplayer, this.key, this._onHeroVsKey, null, this);
            this.game.physics.arcade.overlap(otherplayer, this.door, this._onOtherHeroVsDoor,
            function (otherplayer, door) {
                return keyCollected && otherplayer.body.touching.down;
            }, this);
				
				//send a message that i left FIXME
   //this.game.physics.arcade.overlap(otherplayer, this.spiders,
     //  this._onHeroVsEnemy, this);
    

				//  send me message that you died FIXME
		}

    // hero vs coins (pick up)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    // hero vs key (pick up)
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this);
    // hero vs door (end level)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return keyCollected && hero.body.touching.down;
        }, this);


    // collision: hero vs enemies (kill or die)
    this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this);
    //this.game.physics.arcade.overlap(otherplayer, this.spiders, this._onHeroVsEnemy, null, this);

};

var keyStates = {
	
};


function sendKeyMessage(keyMessage) {
    pubnub.publish(
    {
        message: { 
            uuid: UniqueID,
    			keyMessage: keyMessage,
    			position: window.globalMyHero.position,
    			velocity: window.globalMyHero.body.velocity,
                keyCollected: keyCollected
        },
        channel: window.currentChannelName,
        sendByPost: false, // true to send via posts
    });		
}


PlayState._handleInput = function () {
  //  logCurrentState(this.game);
    if(this.hero){ //Added this so we can control spawning of heros
    	if (this.keys.left.isDown) {
    		if(!keyStates.leftIsDown) {
    			//console.log('left pushed');
    			sendKeyMessage({left: 'down'});
    		}
    		keyStates.leftIsDown = true;
    	} else {
    		if(keyStates.leftIsDown) {
    			//console.log('left un-pushed');
    			sendKeyMessage({left: 'up'});
    		}
    		keyStates.leftIsDown = false;
    	}

    	if (this.keys.right.isDown) {
    		if(!keyStates.rightIsDown) {
    			//console.log('right pushed');
    			sendKeyMessage({right: 'down'});
    		}
    		keyStates.rightIsDown = true;
    	} else {
    		if(keyStates.rightIsDown) {
    			//console.log('right un-pushed');
    			sendKeyMessage({right: 'up'});
    		}
    		keyStates.rightIsDown = false;
    	}

    	if (this.keys.up.isDown) {
    		if(!keyStates.upIsDown) {
    			//console.log('up pushed');
    			sendKeyMessage({up: 'down'});
    			globalMyHero.jump();
    		}
    		keyStates.upIsDown = true;
    	} else {
    		if(keyStates.upIsDown) {
    			//console.log('up un-pushed');
    			sendKeyMessage({up: 'up'});
    		}
    		keyStates.upIsDown = false;
    	}		
		
        if (this.keys.left.isDown) { // move hero left
            this.hero.move(-1);
        }
        else if (this.keys.right.isDown) { // move hero right
            this.hero.move(1);
        }
        else { // stop
            this.hero.move(0);
        }

        // handle jump
        const JUMP_HOLD = 10;//200; // ms
        if (this.keys.up.downDuration(JUMP_HOLD)) {
            //let didJump = this.hero.jump();
            //if (didJump) { /*this.sfx.jump.play();*/ }
        }
        else {
            //this.hero.stopJumpBoost();
        }
				
		for(let uuid of globalOtherHeros.keys()) {
			var otherplayer = globalOtherHeros.get(uuid);
			if(Date.now() + JUMP_HOLD <= otherplayer.jumpStart) {
				//otherplayer.jump();
			} else {
				//otherplayer.stotherplayerJumpBoost();
			}
            if (otherplayer.goingLeft) { // move hero left
                otherplayer.move(-1);			
            }
            else if (otherplayer.goingRight) { // move hero right
                otherplayer.move(1);
            }
            else { // stop
                otherplayer.move(0);
            }
		}
    }
};



function MyClass(name){
    this.name = name;
    //console.log(name);
};

PlayState._onHeroVsKey = function (hero, key) {
    //this.sfx.key.play();
    key.kill();
    keyCollected = true;
    sendKeyMessage(keyCollected)
};

var newCoins = []


function fireCoins() {
    var message = { 
            uuid: UniqueID,
            coinCache: window.globalLevelState.coinCache,
            currentLevel: window.globalCurrentLevel,
            time: window.globalLastTime
        };
    //console.log('fireCoins', message);
    pubnub.fire(
    {
        message: message,
        
        channel: window.currentFireChannelName,
        sendByPost: false, // true to send via posts
    });
}

function logCurrentStateCoin (game, coin) {
    //Log Current Game State of Collected Coins

    for(value of window.globalLevelState.coinCache.coins){
        if(coin.x === value.x){
            window.globalLevelState.coinCache.coins.splice(window.globalLevelState.coinCache.coins.indexOf(value), 1)
            //console.log(value)
        }
    }

    fireCoins();

    //console.log(window.globalLevelState.coinCache.coins)
}

PlayState._onHeroVsCoin = function (hero, coin) {
    //this.sfx.coin.play();
    coin.kill();
    logCurrentStateCoin(this.game, coin);
    this.coinPickupCount++;
};

PlayState._onHeroVsEnemy = function (hero, enemy) {
    // the hero can kill enemies when is falling (after a jump, or a fall)
    if (hero.body.velocity.y > 0) {
        enemy.die();
        hero.bounce();
      //  this.sfx.stomp.play();
    }
    else { // game over -> play dying animation and restart the game
        hero.die();     
        console.log('I think I died');
        //this.sfx.stomp.play();
        hero.events.onKilled.addOnce(function () {
            window.globalUnsubscribe();
          //this.game.state.restart(true, false, {level: this.level - 1});
          createMyPubNub(this.level - 1);
        }, this);

        // NOTE: bug in phaser in which it modifies 'touching' when
        // checking for overlaps. This undoes that change so spiders don't
        // 'bounce' agains the hero
        enemy.body.touching = enemy.body.wasTouching;
    }
};

PlayState._onHeroVsDoor = function (hero, door) {
    // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
    //this.sfx.door.play();

    // play 'enter door' animation and change to the next level when it ends
    hero.freeze();
    this.game.add.tween(hero)
        .to({x: this.door.x, alpha: 0}, 500, null, true)
        .onComplete.addOnce(this._goToNextLevel, this);
};

PlayState._onOtherHeroVsDoor = function (hero, door) {
    // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
    //this.sfx.door.play();

    // play 'enter door' animation and change to the next level when it ends
    hero.freeze();
    this.game.add.tween(hero)
        .to({x: this.door.x, alpha: 0}, 500, null, true);
};

PlayState._goToNextLevel = function () {
    this.camera.fade('#000000');
    this.camera.onFadeComplete.addOnce(function () {
        window.globalUnsubscribe();
        // change to next level
      //window.globalCurrentLevel = this.level + 1; 
        createMyPubNub(this.level + 1);
        /*this.game.state.restart(true, false, {
            level: this.level + 1

        });*/
    }, this);
};

PlayState._loadLevel = function (data) {
    //console.log(data)
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});

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
};

PlayState._addOtherCharacter = function(uuid) {
	if(globalOtherHeros.has(uuid)) { return; }
	//console.log('_addOtherCharacter', uuid);
	this.hero2 = new Hero(this.game, 10, 10);
	this.game.add.existing(this.hero2);
	globalOtherHeros.set(uuid, this.hero2);
}

PlayState._removeOtherCharacter = function(uuid) {
	if(!globalOtherHeros.has(uuid)) { return; }
	globalOtherHeros.get(uuid).destroy();
	globalOtherHeros.delete(uuid);
	
}

PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

        this.hero = new Hero(this.game, 10, 10);
        
		window.globalMyHero = this.hero;
		window.globalOtherHeros = this.otherHeros = new Map();
        this.game.add.existing(this.hero);
        globalMyHero.alpha = 1; //compensating for lag
        sendKeyMessage({});

};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    // spawn invisible walls at each side, only detectable by enemies
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    // physics (so we can detect overlap with the hero)
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    // animations
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    // enable physics to detect collisions, so the hero can pick the key up
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;

    // add a small 'up & down' animation via a tween
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);

    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);

    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
    this.hud.position.set(10, 10);
};

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.disableVisibilityChange = true;
    game.currentRenderOrderID;
    game.state.add('play', PlayState);          
    game.state.add('loading', LoadingState);
    		window.createMyPubNub(0);
            window.StartLoading = function() {
    game.state.start('loading');

            }

};

