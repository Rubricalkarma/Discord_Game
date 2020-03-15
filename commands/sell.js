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
            var index = parseInt(args[1]) -1
            var amount = parseInt(args[2])
            if (isNaN(index)) {
                message.reply(`\`${args[1]}\` is not  valid number!`)
                return;
            }
            if (isNaN(amount)) {
                message.reply(`\`${args[2]}\` is not  valid number!`)
                return;
            }
            if(amount < 1){
                message.reply(`Amount cannot be zero or negative!`)
                return;
            }
            if(index < 0 || index > player.materials.length - 1){
                message.reply(`There is no material in your inventory indexed at \`${index+1}\`!
                Use command \`inv\` and the indicies are located to the left of the material name`)
                return
            }

            //console.log(player.materials[index - 1])
            helper.getMaterialByID(player.materials[index].materialID, client).then(materialInfo => {
                //console.log(materialInfo);
                var playerMats = player.materials[index]
                if (hasEnough(playerMats.quantity, amount)) {
                    console.log('HAS ENOUGH!')
                    var goldToGive = amount * materialInfo.sellPrice
                    helper.removeMaterial(playerMats.materialID, amount, player,client).then(() => {
                        helper.giveGold(goldToGive, message, client).then(()=>{
                            message.channel.send(new Discord.RichEmbed().setTitle('Material(s) Sold!')
                            .setDescription(`You sold ${materialInfo.name} **x${amount}** for ${goldToGive} gold! Cha-Ching!`));
                        })
                    }).catch(err =>{
                        console.log(err);
                    })
                } else {
                    console.log('NOT ENOUGH')
                    return message.reply(`You don't have enough of that material!`)
                    //return message.channel.send(new Discord.RichEmbed().setTitle('Selling Error').setDescription(`You only have \`${playerMats.quantity}\` ${materialInfo.name}!`))
                }


            })

        }

        function hasEnough(amountHas, amountToSell) {
            return amountHas >= amountToSell;
        }

    },
};