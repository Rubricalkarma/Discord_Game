module.exports = {
    name: 'titles',
    description: 'template',
    execute(message, args, client, player) {
        const Discord = require('discord.js')
        const helper = require('../helper.js')


        if (args.length == 0) {
            //console.log(player.titles)
            var titlePromises = [];
            var titleString = "";
            var titleRarity = "";
            var titleEarned = "";
            var embed = new Discord.RichEmbed()
                .setTitle(`:writing_hand: ${message.author.username}'s Titles`)

            if (player.titles.length == 0) {
                var embed = new Discord.RichEmbed().setTitle(`:writing_hand: ${message.author.username}'s Titles`)
                    .setDescription(`You currently don't have any titles.
                    Titles can be earned through leveling skills, earning gold, events, and much more.
                    Keep playing to earn some!`)
                return message.channel.send(embed)
            }

            player.titles.forEach(title => {
                titlePromises.push(client.db("Discord_Game").collection("titleData").findOne({ titleID: title.titleID }))
                titleEarned += `${helper.formatDate(title.earned)}\n`
            });

            Promise.all(titlePromises).then(titles => {
                for (let i = 0; i < titles.length; i++) {
                    let t = titles[i];
                    titleString += `\`${i + 1}\` ${t.name}\n`
                    titleRarity += `${helper.getRarityEmote(t.rarity)}\n`

                }

                //console.log(titleString)

                embed.setDescription(`To set your title, use command \`titles set <index>\`\n
                To remove your title, use command \`titles set none\``)
                embed.addField('Title', titleString, true)
                    .addField('Rarity', titleRarity, true)
                    .addField('Date Earned', titleEarned, true)
                message.channel.send(embed)
            });

        }

        if (args[0] == 'set') {
            let index = -1;

            if (args[1] == null) {
                return message.channel.send(new Discord.RichEmbed().setTitle(':writing_hand: Titles Help').setDescription(`To set your title, use command \`titles set <index>\`\n
                To remove your title, use command \`titles set none\``))
            }

            if (args[1] == 'none' || args[1] == 'null') {
                return client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id }, {
                    $set: {
                        setTitleID: null
                    }
                }).then(results => {
                    var embed = new Discord.RichEmbed()
                        .setTitle(`:writing_hand: Title Changed!`)
                        .setDescription(`You have disabled your title!`)
                    message.channel.send(embed)
                })
            }


            
            index = parseInt(args[1]) - 1;

            if(isNaN(index)){
                return message.channel.send(new Discord.RichEmbed().setTitle(':writing_hand: Titles Error')
                .setDescription(`\`${args[1]}\` is not a valid input for \`titles set <index>\`
                Index must be a number within range of your titles or can be none to disable your title`))
            }
            
            console.log(index)

            titles = player.titles;

            if (index < 0 || index > titles.length - 1) {
                return message.channel.send(new Discord.RichEmbed().setTitle(':writing_hand: Title Error')
                .setDescription(`\`${index+1}\` is not in range of your titles!
                \nUse command \`titles\` to view what titles you own`))
            }

            client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id }, {
                $set: {
                    setTitleID: titles[index].titleID
                }
            }).then(results => {
                client.db("Discord_Game").collection("titleData").findOne({ titleID: titles[index].titleID }).then(result => {
                    var embed = new Discord.RichEmbed()
                        .setTitle(`:writing_hand: Title Changed!`)
                        .setDescription(`Your title has been set to '${result.name}'`)
                    message.channel.send(embed)
                })
            })

        }
        if(args[0] == 'give'){
            //if(helper.isAdmin(player)){
            //helper.giveTitle(parseInt(args[1]),player,client,message)
            message.reply("command disabled atm")
           // }else{
            //    message.channel.send('Only admins have this command!')
            //}
        }
        /*DELETES ALL TITLES REMOVE LATER */
        if(args[0] == 'reset'){
            client.db("Discord_Game").collection("playerData").update({ discordID: player.discordID },{
                $set:{titles: []}
            }).then(()=>{
                console.log("Titles reset!")
            })
        }

    },
};