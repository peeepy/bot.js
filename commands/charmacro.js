const {SlashCommandBuilder, codeBlock} = require(`discord.js`)
const {rollCommand} = require(`./roll.js`)
const fs = require('fs')

module.exports = {
    rollCommand,
    data: new SlashCommandBuilder()
        .setName('c')
        .setDescription(`Execute any previously created macros.`)
        .addStringOption(option =>
            option.setName(`macro`)
                .setDescription(`The macro you created`)
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        async function getTaskForMacro(macro) {
            try {
                // Read the file containing the macros
                const data = await fs.promises.readFile('D:/discordbot/macros.json', 'utf8');
                // Parse the JSON data
                const macroData = JSON.parse(data);
                // Extract the task for the specified macro from the object
                const {[macro]: task} = macroData;
                return task;
            } catch (error) {
                console.error(error);
                await interaction.reply(`Macro not found.`);
            }
        }

        // Usage example
        const task = await getTaskForMacro(macro);

        // Split the task string on the ',' character to separate multiple tasks
        const rolls = task.split(`,`);

        // Iterate over the array of rolls and execute each one
        for (const roll of rolls) {
            // Extract the number of dice and die size from the command
            const numDice = roll.startsWith('d') ? 1 : parseInt(roll.split('d')[0]);
            const diceSize = parseInt(roll.split('d')[1]);
            let modifier = 0;
            if (roll.includes('+')) {
                const [, mod] = roll.split('+');
                modifier = parseInt(mod);
            }

            // Execute the rollCommand function with the extracted values
            const results = rollCommand(numDice, diceSize, modifier);

            // Get the message from the results object
            const message = results.message;

            await interaction.followUp(codeBlock('js', `${message}`));
        }
    }
};