module.exports = {
	name: 'mine',
	description: 'template',
	execute(message, args, client, player) {
        const helper = require('../helper.js')
        helper.payEnergy(client, player, 3).then( () =>{

            message.channel.send(`You go mining and got some rocks!`)

            var loot = [{
                type: 'material',
                id: 1,
                quantity: 1
            }]
        
            helper.gainExp(player,helper.calcExp(player.skills['mining'].level,1),'mining',message,client,loot)
        }).catch(err=>{
            console.log(err)
            message.channel.send(err+'1')
        })
	},
};