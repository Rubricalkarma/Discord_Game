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
            const date = player.timeCreated;
            var skillStats = getSkillString(player);
        const embed = new Discord.RichEmbed()
            .setColor('BLUE')
            .setTitle(`${message.author.username}'s Character`)
            .setDescription(`Level ${player.level} ${player.race.toUpperCase()} ${player.class.toUpperCase()}`)
            .setAuthor(`RPG BOT`, '', '')
            .addField(`Stats`, `
                :moneybag: Gold: ${player.gold}
                :zap: Energy: ${player.energy.energy}/${player.energy.maxEnergy} - ${energyText}`)
            .addField(`Skills`, skillStats[0],true)
            .addField(`Level`,skillStats[1],true)
            .addField(`Experience`,skillStats[2],true)
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

        function getSkillString(player){
            var skills = player.skills;
            var index = [];
            var string = ["","",""];
            for(var x in skills){
                index.push(x);
            }
            
            for(let i = 0; i<index.length;i++){
                var s = player.skills[index[i]];
                var exp = s.experience;
                var expNeeded = helper.experienceForLevel(s.level+1)
                var percent = Math.round(exp/expNeeded*100)
                string[0] += `${s.emote} ${capitalize(index[i])}\n`
                string[1] +=`${s.level}\n`
                string[2] += `[${percent}%] ${exp}/${expNeeded} XP\n`
            }
            return string;
        }
    },
};