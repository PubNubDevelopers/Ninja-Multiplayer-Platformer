
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
    this.level = (data.level || 0);
};

PlayState.create = function () {
	window.globalGameState = this;
	//console.log('window.globalGameState created' , this.level);
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
    window.textObject1 = this.game.add.text(700, 5, window.text1,  { font: "Bold 200px Arial", fill: '#000000', fontSize: '20px' });
    window.textObject2 = this.game.add.text(700, 35, window.text2,  { font: "Bold 200px Arial", fill: '#000000', fontSize: '20px' });
    window.textObject3 = this.game.add.text(700, 65, window.text3,  { font: "Bold 200px Arial", fill: '#000000', fontSize: '20px' });
    console.log(window.text)
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
    this.game.physics.arcade.collide(this.hero, this.platforms);
		for(let uuid of globalOtherHeros.keys()) {
			var otherplayer = globalOtherHeros.get(uuid);
            var collidePlayer = this.game.physics.arcade.collide(otherplayer, this.hero, null, null, this);
            if(this.hero.y > 526){
                this.hero.position.set(this.hero.x, 525);
                console.log("set")
            }else if(otherplayer > 526){
                this.otherplayer.position.set(otherplayer.x, 525);
                 console.log("set2")
            }
			this.game.physics.arcade.collide(otherplayer, this.platforms, null, null, this);
			this.game.physics.arcade.overlap(otherplayer, this.coins, this._onHeroVsCoin, null, this);
            this.game.physics.arcade.overlap(otherplayer, this.key, this._onHeroVsKey, null, this);
            this.game.physics.arcade.overlap(otherplayer, this.door, this._onOtherHeroVsDoor,
            function (otherplayer, door) {
                return keyCollected && otherplayer.body.touching.down;
            }, this);
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

};

var keyStates = {
	
};


function sendKeyMessage(keyMessage) {
    if(window.globalMyHero){
        pubnub.publish(
        {
            message: { 
                uuid: UniqueID,
    			keyMessage: keyMessage,
    			position: window.globalMyHero.position,
                keyCollected: keyCollected
            },
            channel: window.currentChannelName,
            sendByPost: false, // true to send via posts
        });		
        //console.log("send message!")
    }else{
        console.log("Player doesn't exsist so don't set position")
    }
}

var canJump = true;

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

        if(this.hero.body.touching.down){
        	if (this.keys.up.isDown) {
        		if(!keyStates.upIsDown) {
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
        var jumped = false;
        const JUMP_HOLD = 10;//200; // ms
        if (this.keys.up.downDuration(JUMP_HOLD)) {
            //let didJump = this.hero.jump();
            //if (didJump) { this.sfx.jump.play();}
        }

				
		for(let uuid of globalOtherHeros.keys()) {
			var otherplayer = globalOtherHeros.get(uuid);
			if(Date.now() + JUMP_HOLD <= otherplayer.jumpStart) {
				//otherplayer.jump();
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
    this.door.frame = 1;
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
    console.log('fireCoins', message);
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

PlayState._onHeroVsDoor = function (hero, door) {
    // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
    //this.sfx.door.play();

    // play 'enter door' animation and change to the next level when it ends
    hero.freeze();  
    this.game.add.tween(hero)
        .to({x: this.door.x, alpha: 0}, 00, null, true)
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
      //console.log("level we are going to", this.level +1)

      tidCounter = false;
      if(this.level === 2){
        createMyPubNub(0);
      }else{
        createMyPubNub(this.level + 1);
      }

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
    console.log("Added another character to game")
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
        this.hero = new Hero(this.game, 10, 10);
        this.hero.body.bounce.setTo(0);
        playerText = this.game.add.text(this.hero.position.x - 10, this.hero.position.y - 550, "me",  {fill: '#000000', fontSize: '15px' });
        playerText.anchor.set(0.5)
        this.hero.addChild(playerText);
        console.log(playerText.position.x, playerText.position.y)
		window.globalMyHero = this.hero;
		window.globalOtherHeros = this.otherHeros = new Map();
        this.game.add.existing(this.hero);

        //globalMyHero.alpha = 1; //compensating for lag
        sendKeyMessage({});

};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    //console.log("dank", sprite.body.overlapY)
   // this.game.debug.body(sprite);
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