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

        // Extract the number of dice and die size from the command
        const numDice = command.startsWith('d') ? 1 : parseInt(command.split('d')[0]);
        const dieSize = parseInt(command.split('d')[1]);
        let modifier = 0;
        if (command.includes('+')) {
            const [, mod] = command.split('+');
            modifier = parseInt(mod);
        }

        // Generate an array of random rolls using the 'numDice' and 'dieSize' values - modifier isn't added to this
        async function rollCommand(numDice, dieSize, modifier) {
            // Roll the dice
            const resRolls = Array.apply(null, {length: numDice}).map(() => {
                return Math.floor(Math.random() * dieSize - 1) + 1;
            });

            // check if '-s' is present to return separate modifier totals
            const separateModifiers = command.includes('-s');

            // defining message as an empty string to add value to it
            let message = '';
            // defining the total of the rolls
            const total = resRolls.reduce((acc, cur) => acc + cur) + modifier;
            if (separateModifiers) {
                // Add the modifier to each individual roll
                const modifiedRolls = resRolls.map(x => x + modifier);
                message = codeBlock('js,'`${modifiedRolls.join(", ")}\n(Rolls: ${resRolls})`);
            } else {
                // Check if there's a modifier provided, and if so, add it to the total
                message = `${total}\n(Rolls: ${resRolls.join(", ")})`;
                if (modifier) {
                    message += ` + ${modifier}`;
                }
            }

            // keep highest number
            const highest = Math.max(...resRolls)
            const keeph = command.includes('kh');

            //keep lowest number
            const lowest = Math.min(...resRolls)
            const keepl = command.includes('kl');

            // if keeph was added to the end of the command, append the highest roll to the message
            if (keeph) {
                message += `\n(Highest: ${highest})`;
            }

            //if keepl was added to the command, append the lowest roll to the message
            if (keepl) {
                message += `\n(Lowest: ${lowest})`;
            }

            //if not, it should default back to the previous message
            await interaction.deferReply();
            await interaction.followUp(codeBlock('js', `${message}`));
        }

        module.exports = {rollCommand}
    }
};
