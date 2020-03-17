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
        player.materials.forEach(material => {
            materialsPromises.push(client.db("Discord_Game").collection("materialData").findOne({ materialID: material.materialID }))
            //quantityString += `x${material.quantity}\n`
            quantityArray.push(material.quantity)
        })

        Promise.all(materialsPromises).then(materials => {
            for (let i = 0; i < materials.length; i++) {
                let m = materials[i];
                if(m != null){
                materialsString += `\`${i+1}\` ${m.name} **x${quantityArray[i]}**\n`
                valueString += `${m.sellPrice}g\n`
                rarityString += `${helper.getRarityEmote(m.rarity)}\n`
                }
            }

            helper.getTitleByID(player.setTitleID, client).then(title => {

                var titleName = '';
                if (title != null) {
                    titleName = title.name + ' ';
                }
                if (materialsString == "") {
                    materialsString = "Empty!"
                    rarityString = "Empty!"
                    valueString = "Empty!"
                }
                var embed = new Discord.RichEmbed()
                    .setTitle(`:basket: ${titleName}${message.author.username}'s Inventory`)
                    .addField('Materials', materialsString, true)
                    .addField('Rarity', rarityString, true)
                    .addField('Sell Price', valueString, true)

                message.channel.send(embed);
            })
        })
    },
};