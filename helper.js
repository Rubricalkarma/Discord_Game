module.exports = {
    claimEnergy: claimEnergy,
    payEnergy: payEnergy,
    experienceForLevel:experienceForLevel,
    gainExp:gainExp
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
        return Promise.reject(new Error('Not Enough Energy!'));
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

function gainExp(player, experienceGained, skill, message, client){
    var exp = player.skills[skill].experience + experienceGained;
    var level = player.skills[skill].level;
    var levelsGained = 0;
    var expForLevel = experienceForLevel(level+1);
    while(exp >= expForLevel){
        exp -= expForLevel;
        level++;
        levelsGained++;
        expForLevel = experienceForLevel(level+1);
    }
    if(levelsGained > 0){
        message.channel.send(`You gained ${levelsGained} level(s) in ${skill}!\nYour ${skill} is now level ${level}`)
    }
    let levelDB = `skills.${skill}.level`
    let expDB = `skills.${skill}.experience`
    return client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id },
        {
            $set:
            {
                [levelDB]: level,
                [expDB]: exp
            }
        });
}

function levelUp(player, level, experienceGained, skill){

}

function experienceForLevel(level){
    return Math.round(Math.ceil(4.5*Math.pow(level+1,3)/5)/5)*5;
}