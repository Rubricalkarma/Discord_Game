const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token, mongo_uri} = require('./config.json');
const {MongoClient} = require('mongodb');


const mongoClient = new MongoClient(mongo_uri, {useUnifiedTopology: true });
/*
try{
mongoClient.connect();
}catch(e){
    console.log(e);
}
*/
//console.log('Connected to MongoDB');
mongoClient.connect().then(function(result){
    console.log('Connected to MongoDB');
}).catch(function(error){
    console.log(error);
    console.log('There was an error connecting to MongoDB');
})



const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	//console.log(file);
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//console.log(client.commands);




client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
 
client.on('message', msg => {
	//console.log('Message');
	if(!msg.content.startsWith(prefix) || msg.author.bot){
		//console.log("error");
		return;
	}

	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	//console.log(client.commands);

	if (!client.commands.has(command)) {
		msg.reply('Unknown command \`'+command+'\`\nUse `help` for a list of commands!')
		console.log(`Command ${command} not found!`);
		return;
	}

	try {

		/*CHECKS IF USER HAS ACCOUNT*/
		mongoClient.db("Discord_Game").collection("playerData").findOne({ discordID: msg.author.id })
        .then(function(result){
			/*IF NOT RETURNS*/
			if(command === 'start'){
				if(result !== null){
				msg.reply('You already have a character! Use command `delete` to delete your character to startover.')
				}else{
					client.commands.get(command).execute(msg, args, mongoClient);
				}
				return;
			}
			if(result === null){
				msg.reply('You need an account to play, use command `start` to get started!')
				return;
			}
			/*OTHERWISE EXECUTES COMMAND*/
		client.commands.get(command).execute(msg, args, mongoClient,result);
		console.log(`command executed: ${client.commands.get(command).name} for ${msg.author.tag}`);
		});
	} catch (error) {
		console.error(error);
		msg.reply('Sorry, there was an error executing that command. The Server may be down!')
	}

});

client.login(token);