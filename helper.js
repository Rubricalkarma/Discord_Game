module.exports = {
    claimEnergy: claimEnergy,
    payEnergy: payEnergy,
    experienceForLevel: experienceForLevel,
    gainExp: gainExp,
    calcExp: calcExp,
    giveTitle: giveTitle,
    getTitleByID: getTitleByID,
    formatDate: formateDate,
    getRarityEmote: getRarityEmote,
    isAdmin: isAdmin,
    giveMaterial: giveMaterial,
    removeMaterial: removeMaterial,
    getMaterialByID: getMaterialByID,
    giveGold: giveGold
};

function claimEnergy(client, player) {
    /*TIME IN MS SINCE LAST COMMAND*/
    var diff = Math.abs(new Date() - player.energy.lastClaim);

    /*TIME IN MINUTES SINCE LAST COMMAND W BONUS ENERGY*/
    var minutes = Math.floor((diff + player.energy.bonusTime) / 60000)

    /*NUMBER OF ENERGY THEY WILL RECIEVE (ROUNDED DOWN)*/
    var energyToClaim = Math.floor(minutes / player.energy.minutesForEnergy)

    /*BONUS TIME IN MS*/
    /*SAVED TIME SINCE LAST CLAIM THAT CONTRIBUTED TO NEXT CLAIM*/
    var remainingTime = (diff + player.energy.bonusTime) % (player.energy.minutesForEnergy * 60000);

    // console.log(`Energy to claim ${energyToClaim} | Left over time ${player.energy.bonusTime} | Bonus time ${remainingTime} (${remainingTime / 60000}) | Minutes Per Energy ${player.energy.minutesForEnergy}`)

    /*CHECKS IF ENERGY WOULD SET THEM EQUAL OR MORE THAN MAX IF THEY'RE UNDER THRESHOLD*/
    //var test = energyToClaim + player.energy.energy
    //console.log(`comparing ${(typeof test)} to ${player.energy.maxEnergy}`)
    if ((energyToClaim + player.energy.energy) >= player.energy.maxEnergy) {
        console.log('MAX ENERGY')
        /*AMOUNT TO SET THERE ENERGY TO*/
        let energyGain = 0;

        /*IF THEY CURRENTLY HAVE MORE THAN MAX ENERGY, DON'T GIVE ANY MORE*/
        if (player.energy.energy > player.energy.maxEnergy) {
            energyGain = player.energy.energy;
            /*IF THEY'RE CURRENTLY AT MAX, JUST KEEP AT MAX*/
        } else {
            energyGain = player.energy.maxEnergy;
        }
        return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID },
            {
                $set:
                {
                    "energy.energy": energyGain,
                    "energy.bonusTime": 0,
                    "energy.lastClaim": new Date()
                }
            });
        /*ELSE IF GIVE THEM ENERGY IF THEY HAVE ANY AND WON'T REACH MAX*/
    } else if (energyToClaim > 0) {
        console.log('GIVING ENERGY')
        return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID },
            {
                $inc:
                {
                    "energy.energy": energyToClaim
                },
                $set:
                {
                    "energy.bonusTime": remainingTime,
                    "energy.lastClaim": new Date()
                }
            });
        /*NO ENERGY TO GAIN SO RETURN EMPTY PROMISE*/
    } else {
        return Promise.resolve();
    }
}

function payEnergy(client, player, cost) {
    /*CHECKS IF PLAYER HAS ENOUGH ENERGY*/
    if (player.energy.energy < cost) {
        console.log('not enough energy!')
        return Promise.reject(new Error(`This action requires ${cost} energy!`));
    } else {
        return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID },
            {
                $inc: {
                    "energy.energy": -cost
                }
            })
            .then(s => {
                //console.log(s)
                client.db("Discord_Game").collection("playerData").findOne({ discordID: player.discordID });

            }).catch(err => {
                console.log('error in payEnergy')
                console.log(err)
            })
    }
}

function calcExp(level, difficulty) {
    var xp = 6 * level * difficulty
    var min = xp - (xp * .2);
    var max = xp + (xp * .2);
    //console.log(`Level ${level}: ${min} - ${max}`)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function gainExp(player, experienceGained, skill, message, client, loot) {

    const Discord = require('discord.js')
    /*LEVELING*/
    var exp = player.skills[skill].experience + experienceGained;
    var level = player.skills[skill].level;
    var levelsGained = 0;
    var expForLevel = experienceForLevel(level + 1);
    while (exp >= expForLevel) {
        exp -= expForLevel;
        level++;
        levelsGained++;
        expForLevel = experienceForLevel(level + 1);
    }
    var embed = new Discord.RichEmbed()
        .setTitle(`${player.skills[skill].emote} ${capitalize(skill)}`)
    var mString = `Your ${capitalize(skill)} skill gained ${experienceGained} XP!  [${exp}/${expForLevel}]`
    if (levelsGained > 0) {
        mString += `\n\nCongrats! Your ${capitalize(skill)} is now level **${level}**!`;
    }
    /*END LEVELING*/
    embed.setDescription(mString)


    let giveLootPromises = []
    let lootInfoPromises = []
    let quantityString = "";
    // console.log('Loot length' + loot.length)
    for (let i = 0; i < loot.length; i++) {
        let l = loot[i];
        if (l.type == 'material') {
            //console.log('adding to promise array')
            giveLootPromises.push(giveMaterial(l.id, l.quantity, player, client, message));
            lootInfoPromises.push(getMaterialByID(l.id, client))
            quantityString += `**x${l.quantity}**\n`
        }
    }
    return Promise.all(giveLootPromises).then(loot => {


    }).then(() => {
        let lootString = "";
        Promise.all(lootInfoPromises).then(info => {
            //console.log(info)
            info.forEach(x => {
                //console.log('itterating through promise return')
                lootString += `${x.name}\n`
            })
        }).then(() => {
            if (lootString != "") {
                embed.addField('Loot', lootString, true);
                embed.addField('Quantity', quantityString, true)
            }
            message.channel.send(embed);
            let levelDB = `skills.${skill}.level`
            let expDB = `skills.${skill}.experience`
            //console.log('returning')
            client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id },
                {
                    $set:
                    {
                        [levelDB]: level,
                        [expDB]: exp
                    }
                })
        })
    })


}

function experienceForLevel(level) {
    return Math.round(Math.ceil(4.5 * Math.pow(level + 1, 3) / 5) / 5) * 5;
}

function capitalize(x) {
    return x.charAt(0).toUpperCase() + x.substring(1);
}

function removeMaterial(ID, quantity, player, client) {
    for (let i = 0; i < player.materials.length; i++) {
        var material = player.materials[i]
        if (material.materialID == ID) {
            console.log('material found')
            if (material.quantity > quantity) {
                console.log('has enough')
                return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID, "materials.materialID": ID }, {
                    $inc: {
                        "materials.$.quantity": -quantity
                    }
                })
            } else if (material.quantity == quantity) {
                return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID }, {
                    $pull: {
                        materials: { materialID: ID }
                    }
                })
            } else {
                return Promise.reject(new Error('Not Enough Material!'))
            }
        }
    }
    return Promise.reject(new Error('Player does not have this Material!'))
}

function giveMaterial(ID, quantity, player, client, message) {
    var hasMaterial = false;
    player.materials.forEach(material => {
        if (material.materialID == ID) {
            hasMaterial = true;
        }
    })

    if (hasMaterial) {
        //console.log('has material!')
        return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID, "materials.materialID": ID }, {
            $inc: {
                "materials.$.quantity": quantity
            }
        })
    } else {
        return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID },
            {
                $push:
                {
                    materials: {
                        materialID: ID,
                        quantity: quantity
                    }
                }
            });
    }

}

function giveTitle(ID, player, client, message) {
    const Discord = require('discord.js')
    var dup = false;
    player.titles.forEach(title => {
        if (title.titleID == ID) {
            console.log('player already has title!')
            dup = true;
        }
    });
    if (dup) {
        return;
    }

    client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID },
        {
            $push:
            {
                titles: {
                    titleID: ID,
                    earned: new Date()
                }
            }
        }).then(() => {
            getTitleByID(ID, client).then(title => {
                message.channel.send(new Discord.RichEmbed()
                    .setTitle(`:writing_hand: Title Earned`)
                    .setDescription(`Congrats! You've earned the title **${title.name}**
                    *${title.description}*
                    Use command \`titles\` to view and set your titles!`))
            })
        })
}

function getTitleByID(ID, client) {
    return client.db("Discord_Game").collection("titleData").findOne({ titleID: ID })
}

function getMaterialByID(ID, client) {
    return client.db("Discord_Game").collection("materialData").findOne({ materialID: ID })
}

function formateDate(date) {
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

function giveGold(amount, message, client) {
    return client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id },
        {
            $inc:
            {
                gold: amount
            }
        });
}

function getRarityEmote(rarity) {
    switch (rarity) {
        case 'common': return '<:common:688286901748105222>'
        case 'uncommon': return '<:uncommon:688422856564015105>'
        case 'rare': return '<:rare:688424873219063813>'
        case 'epic': return '<:epic:688425686028779628>'
        case 'legendary': return '<:legendary:688426575989178408>'
        case 'unique': return '<:unique:688427003325841436>'
        default: return ':poop:'
    }
}

function isAdmin(player) {
    var admins = ['224927010667888640']
    return admins.includes(player.discordID);
}