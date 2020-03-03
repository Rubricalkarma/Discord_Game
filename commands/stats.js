module.exports = {
	name: 'stats',
	description: 'Shows the user their ID',
	execute(message, args, client) {
        const Discord = require('discord.js');
        client.db("Discord_Game").collection("playerData").findOne({ discordID: message.author.id })
        .then(function(results){
            //console.log(result);
            if(results === null){
                message.reply(`You don't have an account yet!`);
            }else{
            const date = results.timeCreated;
            const embed = new Discord.RichEmbed()
                .setColor('BLUE')
                .setTitle(`${message.author.username}'s Character`)
                .setDescription(`Level ${results.level} ${results.race.toUpperCase()} ${results.class.toUpperCase()}`)
                .setAuthor(`RPG BOT`,'','')
                .addField(`Stats`,`:moneybag: Gold: ${results.gold}`)
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
                .setFooter(`Character created on ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`,'')

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
            }
            
        }).catch(function(error){
            message.reply(`I'm sorry, I appear to be having server problems. Please try again later!`);
            console.log('error in getting stats');
            console.log(error);
        });
	},
};