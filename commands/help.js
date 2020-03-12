module.exports = {
    name: 'help',
    description: 'template',
    execute(message, args, client, player) {
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed()
            .setTitle('Help Commands!')
            .addField('Commands', `
            \`stats\`\tDisplays basic character information
            \`energy\`\tDisplays how long until your next energy
        `)

        message.channel.send(embed)
    },
};