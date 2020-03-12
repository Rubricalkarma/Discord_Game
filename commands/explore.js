module.exports = {
    name: 'explore',
    description: 'Explore the lands!',
    execute(message, args, client, player) {
        const helper = require('../helper.js');
        //console.log(helper.payEnergy(client,player,5))
        //return;
        helper.payEnergy(client, player, 5).then(player => {

            const mobs = ['Deer'];
            const amount = 10;
            const test = 'gold'
            message.reply(`You encountered and pet a *${mobs[0]}*. It then gave you ${amount} Gold`).then(() => {
                client.db("Discord_Game").collection("playerData").updateOne({ discordID: message.author.id },
                    {
                        $inc:
                        {
                            [test]: amount
                        }
                    });
            })

        }).catch(err => {
            message.reply('You do not have enough energy for this action!')
            console.log('Not enough energy for explore')
            //console.log(err);
        });
    },
};