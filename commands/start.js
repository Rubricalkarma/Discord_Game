module.exports = {
	name: 'start',
	description: 'Create a character',
	execute(message, args, client) {
        /*CHECKS DB IF USER ALREADY EXISTS*/
        client.db("Discord_Game").collection("playerData").findOne({ discordID: message.author.id })
        .then(function(result){
            /*IF DATA IS RETURNED THEN THEY ALREADY HAVE AN ACCOUNT*/
            if(result !== null){
                message.reply(`You already have an account! Type FIX ME LATER to delete your account!`);
            }else{
                client.db("Discord_Game").collection("playerData").insertOne({
                    discordID: message.author.id,
                    gold: 100,
                    level: 1,
                    timeCreated: new Date()
                }).then(function(result){
                        message.reply('Your account has been created!');

                });
            }
        }).catch(function(error){
            message.reply(`I'm sorry, I appear to be having server problems. Please try again later!`);
            console.log('Find One Error');
        });
	},
};