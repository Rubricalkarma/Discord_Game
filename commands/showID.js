module.exports = {
	name: 'userid',
	description: 'Shows the user their ID',
	execute(message, args) {
		message.channel.send(`<@${message.author.id}> Your ID is: ${message.author.id}`);
	},
};