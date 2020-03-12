module.exports = {
        name: 'energy',
        description: 'template',
        execute(message, args, client, player) {
                /*ADMIN COMMNAND*/
                if (args[0] === 'set') {
                        return client.db("Discord_Game").collection("playerData").updateOne({ discordID: player.discordID },
                                {
                                        $set:
                                        {
                                                "energy.energy": parseInt(args[1])

                                        }
                                });
                }

                var millis = -1;
                var maxEnergy = false;
                var text = "";
                if (player.energy.energy >= player.energy.maxEnergy) {
                        text = "You are currently at max energy!"
                        maxEnergy = true;
                } else {
                        millis = (player.energy.minutesForEnergy * 60000 - ((Math.abs(new Date() - player.energy.lastClaim) + player.energy.bonusTime) % (player.energy.minutesForEnergy * 60000)));
                        var minutes = Math.floor(millis / 60000);
                        //var seconds = ((millis % 60000) / 1000).toFixed(0);
                }

                message.reply(`You currently have ${player.energy.energy}/${player.energy.maxEnergy}, You will recieve your next energy in ~${minutes} minute(s)
                \nYou gain \`1\` energy every \`${player.energy.minutesForEnergy}\` minute(s)`);


        },
};