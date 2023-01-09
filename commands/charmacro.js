const {SlashCommandBuilder, codeBlock} = require(`discord.js`)
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cm')
        .setDescription(`Execute any previously created macros.`)
        .addStringOption(option =>
            option.setName(`macro`)
                .setDescription(`The macro you created`)
                .setRequired(true)),

    async execute(interaction) {
        const macro = interaction.options.getString('macro')
        async function getTaskForMacro() {
            try {
                // Read the file containing the macros
                const data = await fs.promises.readFile('D:/discordbot/macros.json', 'utf8');
                // Parse the JSON data
                const macroData = JSON.parse(data);
                const keys = Object.keys(macroData);
                if (keys.includes(macro)) {
                    return macroData[macro];
                } else {
                    await interaction.deferReply()
                    await interaction.followUp(`Macro not found.`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        const task = await getTaskForMacro();

        const rollResults = [];
        let ftotal = 0;

// Split the command into individual rolls
        const rolls = task.split(',');

        for (const roll of rolls) {
            // Initialize the variables for this roll
            let numDice = 1;
            let dieSize = 0;
            let modifier = 0;

            if (roll.includes('d')) {
                // The roll is in the form "XdY" or "dY"
                numDice = roll.startsWith('d') ? 1 : parseInt(roll.split('d')[0]);
                dieSize = parseInt(roll.split('d')[1]);
            } else {
                // The roll is in the form "+Z"
                modifier = parseInt(roll);
            }

            // Generate an array of random rolls using the 'numDice' and 'dieSize' values
            const resRolls = Array.apply(null, {length: numDice}).map(() => {
                return Math.ceil(Math.random() * dieSize) + modifier;
            });

            // Add the roll result to the array
            rollResults.push({roll: resRolls});
        }
        // Calculate the total of all the rolls
        ftotal = rollResults.reduce((acc, cur) => {
            if (cur.roll) {
                return acc + cur.roll.reduce((acc, cur) => acc + cur, 0);
            } else {
                return acc + cur;
            }
        }, 0);

        let message = '';
        for (const result of rollResults) {
            message += `[${result.roll.join(", ")}]`;
            message += ' ';
        }
        message = `\u001b[2;35m${ftotal}\u001b[0m\nRolls: ${message}(${macro})`;
        await interaction.deferReply()
        await interaction.followUp(codeBlock('ansi', `${message}`));
    }}