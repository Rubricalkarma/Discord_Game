module.exports = {
	name: 'energy',
	description: 'template',
	execute(message, args, client, player) {
        const currentTime = new Date();
        var diff = Math.abs(currentTime - player.energy.lastClaim);
        var minutes = Math.floor(diff/60000)
        console.log(`Minute(s) since last claim: ${minutes}`);
        var energyToClaim = Math.floor(minutes/player.energy.minutesForEnergy)
        var remainingTime = minutes % player.energy.minutesForEnergy;
        message.reply(`You have ${energyToClaim} energy to claim!\nThere are ${remainingTime} minute(s) until your next energy!`)
	},
};