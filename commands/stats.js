module.exports = {
    name: 'stats',
    description: 'Shows the user their ID',
    execute(message, args, client, player) {
        const Discord = require('discord.js')
        const helper = require('../helper.js');
        var energyText = "";
        if (player.energy.energy >= player.energy.maxEnergy){
            energyText = "MAX"
        }else{
            energyText = (player.energy.minutesForEnergy*60000 - ((Math.abs(new Date() - player.energy.lastClaim) + player.energy.bonusTime) % (player.energy.minutesForEnergy * 60000)))/60000;
        }
        var skills = player.skills;
        var index = [];
        for(var x in skills){
            index.push(x);
        }
        var string = "";
        for(let i = 0; i<index.length;i++){
            var s = player.skills[index[i]];
            console.log(s)
            string += `${s.emote} ${capitalize(index[i])} ${s.level} - ${s.experience}/${helper.experienceForLevel(s.level+1)} XP\n`
            
        }
            const date = player.timeCreated;
        const embed = new Discord.RichEmbed()
            .setColor('BLUE')
            .setTitle(`${message.author.username}'s Character`)
            .setDescription(`Level ${player.level} ${player.race.toUpperCase()} ${player.class.toUpperCase()}`)
            .setAuthor(`RPG BOT`, '', '')
            .addField(`Stats`, `
                :moneybag: Gold: ${player.gold}
                :zap: Energy: ${player.energy.energy}/${player.energy.maxEnergy} - ${energyText}`)
            .addField(`Skills`, string)
            .setThumbnail(message.author.avatarURL)
            .setTimestamp()
            .setFooter(`Character created on ${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`, '')

        message.channel.send(embed);
        /*
        message.channel.send(`Your account was created on ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()} Gold: ${result.gold} `)
            .then(function(msg){
                
             //msg.react('682130663553499146');
             const filter = (reaction) => reaction.emoji.name === '👍' || reaction.emoji.name === '💩';
             const collector = msg.createReactionCollector(filter, {time: 15000})
             collector.on('collect', (reaction) => console.log(reaction.emoji.name));
             collector.on('end', collected => {
                console.log(collected);
                for(const[emoji,reaction] of collected.entries()){
                    for(const[id,users] of reaction.users.entries()){
                        console.log(`${users.username} reacted with ${emoji}`);
                    }
                }
             });
             
        }).catch(console.error);
        //message.channel.send("<:WoW:682130663553499146>");
        */

        function capitalize(x){
            return x.charAt(0).toUpperCase() + x.substring(1);
        }
    },
};