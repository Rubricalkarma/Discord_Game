module.exports = {
    name: 'give',
    description: 'template',
    execute(message, args, client, player) {
        const helper = require('../helper.js')
        const user = message.mentions.users.first();
        helper.getPlayerByID(user.id, client).then(playerToGive => {
            //console.log(player)
            if (args[1]=='materials'){
                helper.giveMaterial(parseInt(args[2]),parseInt(args[3]),playerToGive, client, message)
            }
            if(args[1]=='title'){
                helper.giveTitle(parseInt(args[2]),playerToGive,client,message,true);
            }
            if(args[1]=='experience'){
                helper.gainExp(playerToGive,parseInt(args[3]),args[2],message,client,[{}])
            }
        })

    },
};