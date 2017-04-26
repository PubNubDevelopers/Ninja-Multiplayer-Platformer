# Ninja Real Time Multiplayer Platformer Puzzle Game

## Table of Contents
* [Synopsis](#synopsis)
* [Introduction to Phaser](#phaser)
* [Introduction to PubNub](#pubnub)
* [Credits](#credits)

## <a name="synopsis"></a>Synopsis
Creating a real time multiplayer game can be a daunting task to take on alone.  When I stumbled upon Mozilla’s game development <a href="https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/?utm_source=gamedevjsweekly&utm_medium=email">workshop</a>, I decided to take on the challenge to turn Belén Albeza's workshop into a real time game.  This Ninja Platformer Multiplayer Game uses PubNub’s real time data stream network to manage network traffic between players, and also uses PubNub Blocks to manage game state between devices.  PubNub made the development process incredibly simple and allowed the entire demo to be written in less than a 1000 lines of code!  This feat is incredible for the amount of functionality this game has and is an excellent showcase of both Phaser and PubNub’s capabilities.  

This Ninja Platformer Multiplayer Game is written in javascript and the levels are generated via JSON files with information on the position of the platforms and game objects.

This real time multiplayer game is a collaborative puzzle game that encourages you to work with your friends to collect the keys in clever ways.  Using Phasers Arcade Physics Library, each character and object has its own physics body with its own set of physics properties.  Open up a few browser windows to test out the real time functionailty of the application.

Don’t forget to give it a star and a fork.  It will be exciting to see what you guys can make from this example since it has so much room for expansion. 

## <a name="phaser"></a> Phaser
Phaser is a fast, free, and fun open source HTML5 game framework. It uses a custom build of Pixi.js for WebGL and Canvas rendering, and supports desktop and mobile web browsers. Games can be compiled to iOS, Android and native desktop apps via 3rd party tools. You can use JavaScript or TypeScript for development.  <a href="http://phaser.io/">Learn More</a>

## <a name="pubnub"></a> PubNub
PubNub is a global Data Stream Network (DSN) that allows developers to build realtime web, mobile, IoT applications and real time games.  PubNub API's include a Publish/Subscribe messaging service.  Clients subscribe to a channel name, and any clients that are connected will receive any publish messages sent on that channel.  In addition PubNub offers online presence detection that tracks the online and offline statues of users and devices in realtime. Furthermore, PubNub offers a service called PubNub Blocks which allows developers to customize the data stream in Javascript.  PubNub’s Pub/Sub and Presence is used in this demo to send information on player movements and occupancy in each level.  PubNub Blocks is used as a state machine to detect if the coins of been collected by a player in each level.  PubNub Blocks updates the JSON level object depending upon what actions the players take in the game.  <a href="http://pubnub.com">Learn More</a>

## <a name="credits"></a>Credits
* Jordan Schuetz <schuetz@pubnub.com>
* <a href="https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/?utm_source=gamedevjsweekly&utm_medium=email">Belén Albeza</a>


