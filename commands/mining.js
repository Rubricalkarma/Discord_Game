module.exports = {
	name: 'mine',
	description: 'template',
	execute(message, args, client, player) {
        const helper = require('../helper.js')
        helper.payEnergy(client, player, 3).then( () =>{

            message.channel.send(`You go mining and got some rocks!`)
        
            helper.gainExp(player,helper.calcExp(player.skills['mining'].level,1),'mining',message,client).then( () =>{
                helper.giveMaterial(1,2,player,client,message);
            })
        }).catch(err=>{
            console.log(err)
            message.channel.send(err+'1')
        })
	},
};