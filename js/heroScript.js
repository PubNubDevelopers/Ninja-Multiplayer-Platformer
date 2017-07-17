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
      jumpVar = true;  
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
