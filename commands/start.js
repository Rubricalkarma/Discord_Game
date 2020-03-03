module.exports = {
	name: 'start',
	description: 'Create a character',
	execute(message, args, client) {
        if(args.length === 0 || args[0] === 'help'){
            /*TODO ADD INSTRUCTIONS*/
            message.channel.send('Current Classes: fighter, mage and rogue\nCurrent Races: human, orc, goblin, elf\nUse command \`start race class\`')
            return;
        }
        if(args.length > 2){
            message.reply('Too many arguments!, use `start help` for instructions!');
            return;
        }
        if(args.length < 2){
            message.reply('Too few arguments!, use `start help` for instructions!');
            return;
        }

        const races = ['human','orc','goblin','elf'];
        const classes = ['fighter','mage','rogue'];
        if(!races.includes(args[0].toLowerCase())){
            message.reply(`Unknown race \`${args[0].toLowerCase()}\`, use \`start help\` for instructions!`)
            return;
        }
        if(!classes.includes(args[1].toLowerCase())){
            message.reply(`Unknown class \`${args[1].toLowerCase()}\`, use \`start help\` for instructions!`)
            return;
        }

        let data = {
            discordID: message.author.id,
            gold: 100,
            level: 1,
            race: args[0],
            class: args[1],
            energy:{
                energy: 0,
                maxEnergy: 30,
                minutesForEnergy: 30,
                lastClaim: new Date()
            },
            skills:{
                mining:{
                    level: 1,
                    experience: 0,
                }
            },
            timeCreated: new Date()

        }

                client.db("Discord_Game").collection("playerData").insertOne(
                    data
                ).then(function(result){
                        message.reply('Your character has been created!');

                }).catch(function(error){
                    message.reply(`I'm sorry, I appear to be having server problems. Please try again later!`);
                    console.log('Find One Error');
                });
	},
};