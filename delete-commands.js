const {REST, Routes} = require('discord.js');
const {clientId, guildId, token} = require('./config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(token);

// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1058130951936413876'))
    .then(() => console.log('Successfully deleted guild command'))
    .catch(console.error);

/* for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error); */