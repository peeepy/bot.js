const {codeBlock, SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('r')
        .setDescription('Roll dice')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('The command for rolling dice, such as "d20" or "3d20".')
                .setRequired(true)
        ),
    async execute(interaction) {
        const command = interaction.options.getString('command');

// Initialize the roll results array and the final total
        const rollResults = [];
        let ftotal = 0;

// Split the command into individual rolls
        const rolls = command.split('+');

// Process each roll
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
            let resRolls = Array.apply(null, {length: numDice}).map(() => {
                return Math.ceil(Math.random() * dieSize) + modifier;
            });

            // Add the roll result to the array
            rollResults.push({roll: resRolls});
            console.log(rollResults)
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

        message = `\u001b[2;35m${ftotal}\u001b[0m\nRolls: ${message}(${command})`;

        if (message.length > 2000) {
            await interaction.reply('Error: The output cannot be more than 2,000 characters. Please try splitting up your rolls.')
        }
        //if not, it should default back to the previous message
        await interaction.reply(codeBlock('ansi', `${message}`));
    }
}

