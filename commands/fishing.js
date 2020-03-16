module.exports = {
	name: 'fish',
	description: 'template',
	execute(message, args, client, player) {
		const helper = require('../helper.js')
        helper.payEnergy(client, player, 5).then( () =>{

            //message.channel.send(`You go fishing and caught a fish!`)
            var loot2 = [];
            var loot = [{
                type: 'material',
                id: 2,
                quantity: 1
            },
            {
                type: 'material',
                id: 3,
                quantity: 1
            }
            ]
            helper.gainExp(player,helper.calcExp(player.skills['fishing'].level,1),'fishing',message,client,loot).then( () =>{
                //console.log('END FISHING')
            })
        }).catch(err=>{
            console.log(err)
            message.channel.send(err+"")
        })
	},
};