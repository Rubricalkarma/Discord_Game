module.exports = {
	name: 'fish',
	description: 'template',
	execute(message, args, client, player) {
		const helper = require('../helper.js')
        helper.payEnergy(client, player, 5).then( () =>{

            message.channel.send(`You go fishing and caught a fish!`)
        
            helper.gainExp(player,helper.calcExp(player.skills['fishing'].level,1),'fishing',message,client).then( () =>{
                helper.giveMaterial(2,1,player,client,message);
            })
        }).catch(err=>{
            console.log(err)
            message.channel.send(err+"")
        })
	},
};