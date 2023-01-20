const {REST, Routes} = require('discord.js');
const {clientId, guildId, token} = require('./functions/config.json');
const fs = require('node:fs');

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

/* Construct and prepare an instance of the REST module */
const rest = new REST({version: '10'}).setToken(token);

/* for global commands */
rest.delete(Routes.applicationCommand(clientId, '1062143243988500532'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);

rest.delete(Routes.applicationCommand(clientId, '1061915416672350238'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);

rest.delete(Routes.applicationCommand(clientId, '1061915416672350239'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);

rest.delete(Routes.applicationCommand(clientId, '1061923442506604584'))
    .then(() => console.log('Successfully deleted application command'))
    .catch(console.error);