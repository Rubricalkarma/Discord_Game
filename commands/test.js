module.exports = {
    name: 'test',
    description: 'template',
    execute(message, args, client, player) {
        const helper = require('../helper.js');
        //helper.gainExp(player, 300, 'fishing',message, client)

        /*
        var inventory = [1, 2, 2,1,3,2,1,2,1,2,1,2];
        var promises = [];
        for (let i = 0; i < inventory.length; i++) {
            promises.push(client.db("Discord_Game").collection("TEST_ITEMS").findOne({ itemID: inventory[i] }))
        }

        Promise.all(promises).then(vals => {
            vals.forEach(x => {
                console.log(x.name)
            })
        })

        message.channel.send('<:WoW:682130663553499146>')
        */
        //helper.giveTitle(11, player, client, message);
        //message.reply('Test is disabled right now sorry boys, no free materials')
        //helper.createRecipe(client,player,message,2,3,'smelting')
        helper.getRecipeData([1,2,3,4], client).then(data => {
            message.channel.send(helper.getRecipeEmbed(data, "smelting"))

        })
        /*
        helper.giveMaterial(1,100,player,client,message).then(()=>{
            message.reply(`You suddenly feel a bunch of rocks in your backpack...
            You should use command \`inv\` to check it out!`)
        })
        */
        // helper.removeMaterial(1,4,player,client,message)



        /*
        client.db("Discord_Game").collection("playerData").update({ discordID: player.discordID },{
            $set:{titles: []}
        });
       */



        /*
        client.db("Discord_Game").collection("TEST_ITEMS").findOne({itemID: 1}).then(results =>{
            console.log(results)
        })
        */

        /*
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
        */


    },
};