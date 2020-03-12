module.exports = {
	name: 'test',
	description: 'template',
	execute(message, args, client, player) {
        const helper = require('../helper.js');
        //helper.gainExp(player, 300, 'fishing',message, client)
        
        
        var difficulty = 1
        for(let i=1;i<=10;i++){
            let k = exp(i+1);
            var kill = Math.floor(6*i*difficulty);
            //message.channel.send(`[${i}] - ${k} | Kills Needed: ${Math.ceil(k/kill)} (${kill} exp per kill)`)
            console.log(`[${i}] - ${k} | Kills Needed: ${Math.ceil(k/kill)} (${kill} exp per kill)`)
        }
		function exp(x){
            //return Math.pow(1.8,x+3)
            return Math.round(Math.ceil(4.5*Math.pow(x+1,3)/5)/5)*5;
        }
        
        
	},
};