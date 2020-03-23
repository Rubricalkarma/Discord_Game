module.exports = {
    name: 'inv',
    description: 'template',
    execute(message, args, client, player) {
        const helper = require('../helper.js')
        const Discord = require('discord.js');
        var materialsPromises = [];
        var quantityArray = [];
        var materialsString = "";
        var valueString = "";
        var rarityString = "";
        var pages = [];
        var pageSize = 10;
        var name = "";
        player.materials.forEach(material => {
            materialsPromises.push(client.db("Discord_Game").collection("materialData").findOne({ materialID: material.materialID }))
            quantityArray.push(material.quantity)
        })

        Promise.all(materialsPromises).then(materials => {
            helper.getTitleByID(player.setTitleID, client).then(title => {
                var count = 0;
                for (let i = 0; i < materials.length; i++) {
                    count++;
                    var m = materials[i]
                    if (m != null) {
                        materialsString += `\`${i + 1}\` ${m.name} **x${quantityArray[i]}**\n`
                        valueString += `${m.sellPrice}g\n`
                        rarityString += `${helper.getRarityEmote(m.rarity)}\n`
                    }

                    if (count == pageSize || i == materials.length - 1) {
                        count = 0;
                        pages.push({ mat: materialsString, val: valueString, rare: rarityString })
                        materialsString = "";
                        valueString = "";
                        rarityString = "";
                    }
                }

                var titleName = '';
                if (title != null) {
                    titleName = title.name + ' ';
                }
                name = titleName + message.author.username
                /*
                if (materialsString == "") {
                    materialsString = "Empty!"
                    rarityString = "Empty!"
                    valueString = "Empty!"
                }
                */
                console.log(`there are ${pages.length} pages`)
                message.channel.send('Loading...').then(msg => {
                    if (pages.length > 1) {
                        msg.react('⬅️')
                            .then(() => {
                                msg.react('➡️')
                            })
                    }
                    viewPage(pages, 0, name, msg, message)
                });

            })
        })

        function viewPage(pages, pageIndex, name, message, ogMessage) {
            message.reactions.forEach(reaction => reaction.remove(ogMessage.author.id))
            //console.log(`Viewing Page ${pageIndex + 1}`)
            if (pageIndex < 0) {
                pageIndex++;
            }else if(pageIndex > pages.length - 1){
                pageIndex--;
            }
            var page = pages[pageIndex]
            var embed = new Discord.RichEmbed()
                .setTitle(`:basket: ${name}'s Inventory`)
                .addField('Materials', page.mat, true)
                .addField('Rarity', page.rare, true)
                .addField('Sell Price', page.val, true)
                .setFooter(`Viewing Page ${pageIndex + 1}/${pages.length} ${(pages.length>1) ? '(arrow reactions expire after 15 seconds!)' : ''}`)
            message.edit(embed).then(msg => {

                //message.reactions.forEach(reaction => reaction.remove(msg.author.id))
                const filter = (reaction, user) => {
                    return (reaction.emoji.name === '⬅️' || reaction.emoji.name === "➡️") && user.id === ogMessage.author.id;
                };

                /*
                if (pageIndex > 0 && pageIndex < pages.length - 1) {
                    msg.react('⬅️').then(() => {
                        msg.react('➡️')
                    })
                } else if (pageIndex > 0) {
                    msg.react('⬅️')
                } else if (pageIndex < pages.length - 1) {
                    msg.react('➡️')
                }
                */

                const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });

                collector.on('collect', (reaction, reactionCollector) => {
                    console.log(`Collected ${reaction.emoji.name}`);
                    if (reaction.emoji.name == '➡️') {

                        viewPage(pages, pageIndex + 1, name, message, ogMessage)
                    }
                    if (reaction.emoji.name == '⬅️') {
                        viewPage(pages, pageIndex - 1, name, message, ogMessage)
                    }
                });

                collector.on('end', collected => {
                    //console.log(`Collected ${collected.size} items`);
                });

            })
        }
    },
};