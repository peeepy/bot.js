//import the required files for classes
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, Events } = require('discord.js');
const { token } = require('./functions/config.json');
const { Player } = require('discord-player');

//create new client instance
module.exports =
client = new Client({intents: [32767]});
global.player = new Player(client);
client.commands = new Collection();

if (!fs.existsSync("data.json")) {
    fs.writeFileSync("data.json", JSON.stringify({ "songs-played": 0, "queues-shuffled": 0, "songs-skipped": 0 }));
}

//command handling and displaying successful message when client is connected
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    module.exports =
        { client }
});

const functions = fs.readdirSync("./functions").filter((file) => file.endsWith(".js"));

//login to discord
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents();
})();

client.login(token);