const {SlashCommandBuilder} = require(`discord.js`)
const fs = require('fs');
global.store = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('m')
        .setDescription(`Create a macro.`)
        .addStringOption(option =>
            option.setName(`name`)
                .setDescription(`The name of the macro`)
                .setRequired(true))
        .addStringOption(option =>
            option.setName(`task`)
                .setDescription(`The task of the macro`)
                .setRequired(true)),

    async execute(interaction) {
        const macro = interaction.options.getString("name");
        const task = interaction.options.getString("task");

        await interaction.deferReply();
        // create macro from the input
        store.set(macro, task);

        async function saveMacros() {
            try {
                // Read the file
                const data = await fs.promises.readFile('D:/discordbot/macros.json', 'utf8');
                // Parse the JSON data
                console.log(data)
                let macroData = JSON.parse(data) || {};
                console.log(data)
                // Add the new macro to the object
                for (const [key, value] of store) {
                    macroData[key] = value;
                }
                console.log(macroData)
                // Write the updated object back to the file
                await fs.promises.writeFile('D:/discordbot/macros.json', JSON.stringify(macroData));
                console.log(macroData)
            } catch (error) {
                console.error(error);
            }
        }

        console.log(store.size)
        // save to the json
        await saveMacros(global.store);
        console.log(store.size)
        //confirm
        await interaction.followUp(`Macro created.`);
    }
};
