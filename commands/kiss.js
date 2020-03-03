module.exports = {
	name: 'kiss',
	description: 'kiss',
	execute(message, args, client) {
        const user = message.mentions.users.first();
        //console.log(message.mentions.users.first())
		message.channel.send(`${message.author.username} gave ${user.username} a big smooch :kiss:`)
	},
};