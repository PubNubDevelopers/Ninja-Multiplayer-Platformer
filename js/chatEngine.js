function generateName() {
    // Colors and Animals for randomly generated names
    var colors = ['amaranth', 'amber', 'amethyst', 'apricot', 'aquamarine', 'azure', 'beige', 'black', 'blue', 'blush', 'bronze', 'brown', 'burgundy', 'cerulean', 'champagne', 'chartreuse', 'chocolate', 'cobalt', 'coffee', 'copper', 'coral', 'crimson', 'cyan', 'desert', 'electric', 'emerald', 'erin', 'gold', 'gray', 'green', 'harlequin', 'indigo', 'ivory', 'jade', 'jungle', 'lavender', 'lemon', 'lilac', 'lime', 'magenta', 'maroon', 'mauve', 'navy', 'ocher', 'olive', 'orange', 'orchid', 'peach', 'pear', 'periwinkle', 'pink', 'plum', 'purple', 'raspberry', 'red', 'rose', 'ruby', 'salmon', 'sangria', 'sapphire', 'scarlet', 'silver', 'slate', 'tan', 'taupe', 'teal', 'turquoise', 'violet', 'viridian', 'white', 'yellow'];
    var animals = ['alligator', 'bear', 'cat', 'chinchilla', 'cow', 'coyote', 'crocodile', 'dolphin', 'duck', 'fish', 'fox', 'gecko', 'hamster', 'hippopotamus', 'jaguar', 'leopard', 'liger', 'lion', 'lynx', 'monkey', 'ocelot', 'octopus', 'panther', 'penguin', 'pig', 'rhinoceros', 'seal', 'skunk', 'sloth', 'starfish', 'stingray', 'tiger', 'tortoise', 'toucan', 'turtle', 'whale', 'wolf'];

    var color = colors[Math.floor(Math.random() * colors.length)];
    var animal = animals[Math.floor(Math.random() * animals.length)];

    return color + '-' + animal;
}

window.initChatEngine = function() {
    // Don't draw the Chat UI more than once
    if (document.getElementById('chatLog')) return;

    var domChatContent = `
    <div class="chat-container">
        <div class="content">
            <div class="chat-log" id="chatLog"></div>
            <div class="chat-input">
                <textarea
                  id="chatInput"
                  placeholder="message..."
                  maxlength="20000"
                ></textarea>
            </div>
        </div>
    </div>
    `;

    function onMessage(message) {
        var uuid = message.data.uuid;
        var text = message.data.text;

        // add the message to the chat UI
        var domContent = `<div class="chat-message"><b>${uuid}:</b> ${text}</div>`;
        chatLog.insertAdjacentHTML('beforeend', domContent);
        scrollBottom();

        // add the message to the top of the player's head in game
        var notMe = window.globalOtherHeros.get(uuid);

        if (uuid === window.UniqueID) {
            window.globalMyHero.children[0].text = text.substring(0, 10);
        } else if (notMe) {
            notMe.children[0].text = text.substring(0, 10);
        }
    }

    function sendMessage(e) {
        if (e.keyCode === 13 && !e.shiftKey) e.preventDefault();

        var focussed = chatInput.matches(':focus');

        if (focussed && e.keyCode === 13 && chatInput.value.length > 0) {
            var text = chatInput.value;
            
            ChatEngine.global.emit('message', {
                text: text,
                uuid: window.UniqueID
            });

            chatInput.value = '';
        }
    }

    function scrollBottom() {
        chatLog.scrollTo(0, chatLog.scrollHeight);
    }

    // Add Chat UI to the DOM
    var gameContainer = document.getElementById('game');
    gameContainer.insertAdjacentHTML('beforeend', domChatContent);

    // Chat log element
    var chatLog = document.getElementById('chatLog');

    // Textarea of the chat UI
    var chatInput = document.getElementById('chatInput');

    // Add event listener for the textarea of the chat UI
    chatInput.addEventListener('keypress', sendMessage);

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    // ChatEngine 
    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

    var name = window.UniqueID;

    // Connect the ChatEngine App (Different PubSub keys from game)
    var ChatEngine = ChatEngineCore.create({
        publishKey: 'pub-c-7e9dc0d1-d87e-4cd1-abd3-2b6541769cc3',
        subscribeKey: 'sub-c-4abb1192-5a2b-11e8-85c6-a6b0a876dba1'
    }, {
        globalChannel: 'chat-engine-phaser-demo'
    });

    var client = {
        uuid: name,
        name: name
    };

    ChatEngine.connect(client.uuid, client);

    ChatEngine.on('$.ready', function(data) {
        // Every time a message is recieved from PubNub, render it.
        ChatEngine.global.on('message', onMessage);

        // Get the 4 most recent messages when the page laods
        ChatEngine.global.search({
          event: 'message',
          limit: 4,
        }).on('message', onMessage);
    });
};