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
    giveGold: giveGold,
    getPlayerByID: getPlayerByID,
    createRecipe: createRecipe,
    getMultipleMaterialsByID: getMultipleMaterialsByID,
    getRecipeByID: getRecipeByID,
    getRecipeData: getRecipeData,
    getRecipeEmbed: getRecipeEmbed
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
function getRecipeEmbed(data, skill) {
    const Discord = require('discord.js')
    var embed = new Discord.RichEmbed();
    embed.setTitle(`${capitalize(skill)} Recipes`)
    let count = 0;
    data.recipes.forEach(recipe => {
        count++;
        var outputString = "";
        var ingString = ""
        console.log(`${recipe.recipe.name}`)
        recipe.output.forEach(output => {
            outputString += `\`${count}\` ${output.material.name} x${output.quantity}`
        })
        recipe.ingredients.forEach(ingredient => {
            ingString += `${ingredient.material.name} x${ingredient.quantity}\n`
        })
        embed.addField(`${outputString}`, `${ingString}`, true)
    })

    return embed;

}

function getRecipeByID(recipeID, client) {
    return client.db("Discord_Game").collection("recipeData").findOne({ recipeID: recipeID })
}
function getRecipeData(recipeIDs, client) {
    var data = {
        recipes: []
    }
    var recipeRawDataPromises = []
    recipeIDs.forEach(x => {
        recipeRawDataPromises.push(getRecipeByID(x, client))
    })
    return Promise.all(recipeRawDataPromises).then(recipeRawData => {
        //console.log(recipeRawData)
        var uhOh = []
        recipeRawData.forEach(x => {
            //console.log('HELLO')
            uhOh.push(Promise.all([materialIDAndQuantityToArray(x.output, client), materialIDAndQuantityToArray(x.ingredients, client)]))
        })
        return Promise.all(uhOh).then(k => {
            //console.log(k.length)
            for (let i = 0; i < k.length; i++) {
                //console.log('pushing')
                data.recipes.push({ recipe: recipeRawData[i], ingredients: k[i][1], output: k[i][0] });
            }
            //console.log(data)
            return data;

        })
    })
}
/*Takes in Array of materialIDs and Quantities and returns them as Material Obj and Quantity*/
function materialIDAndQuantityToArray(materialAndQuantityArray, client) {
    var materials = [];
    var quantities = [];
    var materialPromises = [];
    materialAndQuantityArray.forEach(materialAndQuantity => {
        materialPromises.push(getMaterialByID(materialAndQuantity.materialID, client))
        quantities.push(materialAndQuantity.quantity);
    })
    return Promise.all(materialPromises).then(x => {
        x.forEach(obj => {
            materials.push(obj)
        })
        var mats = [];
        for (let i = 0; i < materials.length; i++) {
            mats.push({ material: materials[i], quantity: quantities[i] })
        }
        return Promise.resolve(mats)
    })

}

function createRecipe(client, player, message, recipeID, quantityToCraft) {
    getRecipeByID(recipeID, client).then(recipe => {
        var ids = []
        recipe.ingredients.forEach(x => {
            ids.push(x.materialID)
        })
        var ingData = hasIngredients(recipe.ingredients, player.materials, quantityToCraft);
        if (ingData.hasIng) {
            console.log("Has ingredients!")
            var removeIngPromises = []
            recipe.ingredients.forEach(ing => {
                removeIngPromises.push(removeMaterial(ing.materialID, ing.quantity * quantityToCraft, player, client))
            })
            Promise.all(removeIngPromises).then(() => {
                var giveMatPromises = [];
                recipe.output.forEach(recipeOutput => {
                    giveMatPromises.push(giveMaterial(recipeOutput.materialID, recipeOutput.quantity * quantityToCraft, player, client))
                });
                Promise.all(giveMatPromises).then(() => {
                    message.channel.send(`${recipe.name} x${quantityToCraft} crafted!`)
                })

            })

        } else {
            var missingPromises = [];
            var missingString = "";
            ingData.missing.forEach(x => {
                missingPromises.push(getMaterialByID(x[0], client))
            })
            Promise.all(missingPromises).then(missingMaterials => {
                for (let i = 0; i < missingMaterials.length; i++) {
                    missingString += `Missing ${missingMaterials[i].name} x${ingData.missing[i][1]} \n`
                }
                message.channel.send(missingString)
            })


        }
    })
}

function hasIngredients(recipeIngredients, materials, quantityToCraft) {
    var materialsIDArray = []
    var hasIng = true;
    var data = {
        hasIng: true,
        missing: []
    }
    var errorLog = "";
    materials.forEach(x => {
        materialsIDArray.push(x.materialID);
    })

    console.log(materialsIDArray)
    for (let i = 0; i < recipeIngredients.length; i++) {
        //console.log(recipeIngredients[i].materialID)
        var inc = customIncludes(materialsIDArray, recipeIngredients[i].materialID);

        console.log(inc)
        if (inc > -1) {
            if (materials[inc].quantity >= recipeIngredients[i].quantity * quantityToCraft) {

            } else {
                data.missing.push([materials[inc].materialID, (recipeIngredients[i].quantity * quantityToCraft) - materials[inc].quantity])
                data.hasIng = false
            }
        } else {
            data.missing.push([recipeIngredients[i].materialID, recipeIngredients[i].quantity * quantityToCraft])
            data.hasIng = false
        }
    }
    return data;
}
function customIncludes(arr1, obj) {
    var index = -1;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] == obj) {
            return i;
        }
    }
    return index;
}

function getMultipleMaterialsByID(client, materialIDs) {
    var promises = []
    materialIDs.forEach(x => {
        promises.push(getMaterialByID(x, client))
    })
    return Promise.all(promises)
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
        levelsGained++;
        expForLevel = experienceForLevel(level + levelsGained + 1);
    }
    var embed = new Discord.RichEmbed()
        .setTitle(`${player.skills[skill].emote} ${capitalize(skill)}`)
    var mString = `Your ${capitalize(skill)} skill gained ${experienceGained} XP!  [${exp}/${expForLevel}]`
    if (levelsGained > 0) {
        level += levelsGained
        mString += `\n\nCongrats! Your ${capitalize(skill)} is now level **${level}**!`;
    }
    /*END LEVELING*/
    embed.setDescription(mString)


    let giveLootPromises = []
    let lootInfoPromises = []
    let quantityString = "";
    for (let i = 0; i < loot.length; i++) {
        let l = loot[i];
        if (l.type == 'material') {
            giveLootPromises.push(giveMaterial(l.id, l.quantity, player, client, message));
            lootInfoPromises.push(getMaterialByID(l.id, client))
            quantityString += `**x${l.quantity}**\n`
        }
    }
    return Promise.all(giveLootPromises).then(loot => { }).then(() => {
        let lootString = "";
        Promise.all(lootInfoPromises).then(info => {
            info.forEach(x => {
                lootString += `${x.name}\n`
            })
        }).then(() => {
            if (lootString != "") {
                embed.addField('Loot', lootString, true);
                embed.addField('Quantity', quantityString, true)
            }
            message.channel.send(embed);
            gainLevel(level, exp, skill, message, client)
        })
    })

}

function gainLevel(newLevel, newExp, skill, message, client) {
    let levelDB = `skills.${skill}.level`
    let expDB = `skills.${skill}.experience`
    client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id },
        {
            $set:
            {
                [levelDB]: newLevel,
                [expDB]: newExp
            }
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

function giveTitle(ID, player, client, message, sendMessage) {
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
            if (sendMessage) {
                getTitleByID(ID, client).then(title => {
                    message.channel.send(new Discord.RichEmbed()
                        .setTitle(`:writing_hand: Title Earned`)
                        .setDescription(`Congrats! You've earned the title **${title.name}**
                    *${title.description}*
                    Use command \`titles\` to view and set your titles!`))
                })
            }
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

function getPlayerByID(playerID, client) {
    return client.db("Discord_Game").collection("playerData").findOne({ discordID: playerID })
}

function checkRewards(player, client, message, category) {
    var rewards = []
    switch (category) {
        case 'mining': return;
            break;
    }
}