module.exports = {
    name: 'sell',
    description: 'template',
    execute(message, args, client, player) {
        const helper = require('../helper.js')
        const Discord = require('discord.js')
        if (args.length == 0 || args[0] == 'help') {
            /*HELP*/
            message.channel.send(new Discord.RichEmbed().setTitle('Sell Help').setDescription(`
            To sell items. Use command \`<inventory> <inventory slot> <amount>\`
            \`<inventory>\` is either \`materials\` \`equipment\` \`consumables\` **EQUPIMENT AND CONSUMBLES NOT IMPLEMENTED!!**
            \`<inventory slot>\` is item number from your inventory (left of the item name)`))
            return;
        }
        if (args.length > 0 && args.length < 3) {
            message.reply('too few arguments')
            return;
        }
        if (args.length > 3) {
            message.reply('too many arguments')
            return;
        }
        if (args[0] == 'materials') {
            var index = parseInt(args[1]) - 1
            var amount = parseInt(args[2])
            if (isNaN(index)) {
                message.reply(`\`${args[1]}\` is not  valid number!`)
                return;
            }
            if (isNaN(amount)) {
                message.reply(`\`${args[2]}\` is not  valid number!`)
                return;
            }
            if (amount < 1) {
                message.reply(`Amount cannot be zero or negative!`)
                return;
            }
            if (index < 0 || index > player.materials.length - 1) {
                message.reply(`There is no material in your inventory indexed at \`${index + 1}\`!
                Use command \`inv\` and the indicies are located to the left of the material name`)
                return
            }

            //console.log(player.materials[index - 1])
            helper.getMaterialByID(player.materials[index].materialID, client).then(materialInfo => {
                //console.log(materialInfo);
                var playerMats = player.materials[index]
                if (hasEnough(playerMats.quantity, amount)) {
                    var goldToGive = amount * materialInfo.sellPrice
                    var replied = false;
                    const filter = (reaction, user) => {
                        return (reaction.emoji.name === '👍' || reaction.emoji.name === "👎") && user.id === message.author.id;
                    };
                    message.channel.send(new Discord.RichEmbed().setTitle('Confirm Sell')
                        .setDescription(`Confirm you want to sell ${materialInfo.name} **x${amount}** for ${goldToGive} gold?`)).then(confirmation => {
                            const collector = confirmation.createReactionCollector(filter, { time: 15000, max: 1 });
                            confirmation.react('👍').then(() => {
                                confirmation.react('👎').then(() => {
                                    collector.on('collect', (reaction, reactionCollector) => {
                                        console.log(`Collected ${reaction.emoji.name}`);
                                        if (reaction.emoji.name === "👎") {
                                            message.channel.reply(`Sell canceled! Your items have not been sold.`)
                                        } else {
                                            helper.removeMaterial(playerMats.materialID, amount, player, client).then(() => {
                                                helper.giveGold(goldToGive, message, client).then(() => {
                                                    message.channel.send(new Discord.RichEmbed().setTitle('Material(s) Sold!')
                                                        .setDescription(`You sold ${materialInfo.name} **x${amount}** for ${goldToGive} gold! Cha-Ching!`));
                                                })
                                            }).catch(err => {
                                                console.log(err);
                                            })
                                        }
                                        replied = true;
                                    });

                                    collector.on('end', collected => {
                                        if (!replied) {
                                            message.channel.reply(`Sell canceled! Your items have not been sold.`)
                                        }
                                    });
                                })
                            })
                        })

                } else {
                    console.log('NOT ENOUGH')
                    //return message.reply(`You don't have enough of that material!`)
                    return message.channel.send(new Discord.RichEmbed().setTitle('Selling Error').setDescription(`You only have \`${playerMats.quantity}\` ${materialInfo.name}!`))
                }


            })

        }

        function hasEnough(amountHas, amountToSell) {
            return amountHas >= amountToSell;
        }

    },
};