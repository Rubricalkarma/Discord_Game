module.exports = {
	name: 'delete',
	description: 'Delete user account',
	execute(message, args, client) {
        const filter = response => response.author.id === message.author.id;
        message.reply('WARNING: All progress will be lost, this cannot be undone!\n Type `confirm` to delete your character')
        .then( () => {
            message.channel.awaitMessage(filter, {maxMatches: 1, })
        });
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