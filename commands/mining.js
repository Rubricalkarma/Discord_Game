module.exports = {
	name: 'mine',
	description: 'template',
	execute(message, args, client, player) {
        const helper = require('../helper.js')
        helper.payEnergy(client, player, 3).then( () =>{
            message.channel.send(`You go mining!`)
            helper.gainExp(player,helper.calcExp(player.level,1),'mining',message,client);
        }).catch(err=>{
            console.log(err)
            message.channel.send(err+'1')
        })
	},
};