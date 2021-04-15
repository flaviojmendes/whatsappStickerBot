import {create, Client, Message} from '@open-wa/wa-automate';
import * as util from "util";
const gis = require('g-i-s')

create().then(client => start(client));

let messageControl: Message

function start(client) {
    client.onMessage(async message => {
        await  handleMessage(message, client);
    });

    setInterval(() => {
    client.getMyLastMessage().then(async message => {
        if(!messageControl || messageControl.content != message.content) {
            messageControl = message;
            await handleMessage(message, client);
        }
    })
    }, 1000)
}

async function handleMessage(message: Message, client: Client) {
    if (message.body === 'Hi') {
        await client.sendText(message.from, '👋 Hello!');
    } else if (message.body && message.body.startsWith('.gif ')) {
        const gif = await getGif(message.body.replace('.gif ', ''));
        await client.sendStickerfromUrl(message.chatId, gif)
    }
}

async function getGif(searchText: string) {

    const asyncFunction = util.promisify(gis)

    const opts = {
        searchTerm: searchText,
        // This will force the search by animated images
        queryStringAddition: '&tbs=itp:animated'
    }

    const result = await asyncFunction(opts)

    return result[0].url
}