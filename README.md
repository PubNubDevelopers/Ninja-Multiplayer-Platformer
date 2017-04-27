# Ninja Multiplayer Platformer Game in Real Time #

## Play Now: https://pubnub.github.io/Ninja-Multiplayer-Platformer/
![Screenshot](readmepics/screenshot1.png)
## Table of Contents
* [Synopsis](#synopsis)
* [Introduction to Phaser](#phaser)
* [Introduction to PubNub](#pubnub)
* [Getting Started](#getting-started)
* [Credits](#credits)

## <a name="synopsis"></a>Synopsis
Creating a real time multiplayer game can be a daunting task to take on alone.  When I stumbled upon Mozilla’s game development <a href="https://hacks.mozilla.org/2017/04/html5-games-workshop-make-a-platformer-game-with-javascript/?utm_source=gamedevjsweekly&utm_medium=email">workshop</a>, I decided to take on the challenge to turn Belén Albeza's workshop into a real time game.  This Ninja Platformer Multiplayer Game uses PubNub’s real time data stream network to manage network traffic between players, and also uses PubNub Blocks to manage game state between devices.  PubNub made the development process incredibly simple and allowed the entire demo to be written in less than a <b>1000 lines of code!!!</b>  This feat is incredible for the amount of functionality this game has and is an excellent showcase of both Phaser and PubNub’s capabilities.  

This Ninja Platformer Multiplayer Game is written in javascript and the levels are generated via JSON files with information on the position of the platforms and game objects.

This real time multiplayer game is a collaborative puzzle game that encourages you to work with your friends to collect the keys in clever ways.  Using Phasers Arcade Physics Library, each character and object has its own physics body with its own set of physics properties.  Open up a few browser windows to test out the real time functionailty of the application.

Don’t forget to give it a star and a fork.  It will be exciting to see what you guys can make from this example since it has so much room for expansion. 

## <a name="phaser"></a> Phaser
Phaser is a fast, free, and fun open source HTML5 game framework. It uses a custom build of Pixi.js for WebGL and Canvas rendering, and supports desktop and mobile web browsers. Games can be compiled to iOS, Android and native desktop apps via 3rd party tools. You can use JavaScript or TypeScript for development.  <a href="http://phaser.io/">Learn More</a>

## <a name="pubnub"></a> PubNub
PubNub is a global Data Stream Network (DSN) that allows developers to build realtime web, mobile, IoT applications and real time games.  PubNub API's include a Publish/Subscribe messaging service.  Clients subscribe to a channel name, and any clients that are connected will receive any publish messages sent on that channel.  In addition PubNub offers online presence detection that tracks the online and offline statues of users and devices in realtime. Furthermore, PubNub offers a service called PubNub Blocks which allows developers to customize the data stream in Javascript.  

PubNub’s Pub/Sub and Presence is used in this demo to send information on player movements and occupancy in each level.  PubNub Blocks is used as a state machine to detect if the coins of been collected by a player in each level.  PubNub Blocks updates the JSON level object depending upon what actions the players take in the game.  <a href="http://pubnub.com">Learn More</a>

## <a name="getting-started"></a> Getting Started
In order to start the development process, you are going to need a few things:
* A text editor (I recommend <https://www.sublimetext.com/>)
* Terminal / Console
* A local web server (then eventually a public web server to share your project with friends)
* A PubNub Account (<a href="http://pubnub.com">Sign Up for Free</a>)

Create a new folder anywhere you wish, for simplicity create it on your Desktop.  If you have Mac OS or Linux (or have Python installed), open up your Terminal Application and type in:

``
python -m SimpleHTTPServer 8000
``

If you are using Windows download <a href="https://www.apachefriends.org/index.html">XAMPP</a>.  There are some great tutorials out there on how to setup XAMPP on your machine.

Once you have your server up and running, go to ``http://localhost:8000/`` on your machine and navigate to your project directory.  You are ready to start coding! 

Now in order to get you setup with PubNub, navigate to the <a href="http://pubnub.com">PubNub Website</a> and create an account with your Google login.  Once you are in the dashboard, name your application whatever you wish, and click the Create New App button.  Once you create the application, click on the application to few the key information.  You should see that you have two keys, a Publish Key, and a Subscribe Key.  Click on the demo keyset, and it should load up a page that shows your keys in addition to Application Add-Ons.  In the Application Add-Ons section, turn <b>ON</b> <em>Presence</em> and check <b>Generate Leave on TCP FIN or RST</b> and <b>Global Here Now</b>.  Also turn <b>ON</b> <em>PubNub Blocks</em>.  Leave the page open for future reference once we start writting our code, we are going to need those PubNub keys!


## <a name="credits"></a>Credits
* <a href="https://github.com/JordanSchuetz">Jordan Schuetz </a>(Contact me if you have questions <schuetz@pubnub.com>)
* <a href="https://twitter.com/ladybenko">Belén Albeza</a>
* <a href="https://github.com/codepilot">Daniel Kluss</a>


