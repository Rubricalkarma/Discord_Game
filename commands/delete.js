module.exports = {
	name: 'delete',
	description: 'Delete user account',
	execute(message, args, client) {
        client.db("Discord_Game").collection("playerData").deleteOne({ discordID: message.author.id })
        .then(function(result, reject){
            console.log(result.deletedCount);
            if(result.deletedCount == 1){
                message.reply(`Your account has been deleted!`);
            }
        }).catch(function(error){
            message.reply(`I'm sorry, I appear to be having server problems. Please try again later!`);
            console.log('Error in Delete Account');
        });
	},
};