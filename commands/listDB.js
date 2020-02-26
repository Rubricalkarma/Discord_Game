module.exports = {
	name: 'db',
	description: 'Shows the list of databases',
	execute(message, args, client) {
    client.db().admin().listDatabases().then(function(result,reject){
        
    });
	},
};