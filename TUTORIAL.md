# Realtime Multiplayer Game with PubNub Tutorial #

## Table of Contents
* [Setup Your Machine](#setup)
* [Launch a Local Server](#launchserver)
* [Initialize Phaser](#initialize)

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

## <a name="initialize"></a>Initialize Phaser


