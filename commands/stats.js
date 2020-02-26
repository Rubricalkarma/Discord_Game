module.exports = {
	name: 'stats',
	description: 'Shows the user their ID',
	execute(message, args, client) {
        client.db("Discord_Game").collection("playerData").findOne({ discordID: message.author.id })
        .then(function(result){
            //console.log(result);
            if(result === null){
                message.reply(`You don't have an account yet!`);
            }else{
            const date = result.timeCreated;
            message.channel.send(`Your account was created on ${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()} `);
            message.react('682130663553499146');
            //message.channel.send("<:WoW:682130663553499146>");
            }
        }).catch(function(error){
            message.reply(`I'm sorry, I appear to be having server problems. Please try again later!`);
            console.log('error in getting stats');
        });
	},
};