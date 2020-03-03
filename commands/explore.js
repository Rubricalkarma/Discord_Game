module.exports = {
	name: 'explore',
	description: 'Explore the lands!',
	execute(message, args, client, character) {
        const mobs = ['Deer'];
        message.reply(`You encountered and pet a *${mobs[0]}*. It then gave you 10 Gold`).then(()=>{
            client.db("Discord_Game").collection("playerData").updateOne({discordID: message.author.id},{$inc: {gold: 10}});
        })
	},
};