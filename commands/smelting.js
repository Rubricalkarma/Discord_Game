module.exports = {
	name: 'smelt',
	description: 'template',
	execute(message, args, client, player) {
		const helper = require('../helper.js')
		const Discord = require('discord.js')
		var embed = new Discord.RichEmbed();
		if (args.length == 0) {
			client.db("Discord_Game").collection("recipeData").find({ skill: "smelting" }).toArray().then(data => {
				//console.log(data)
				var promises = []
				data.forEach(recipe => {
					promises.push(help(recipe, client))
				});
				Promise.all(promises).then(x => {
					console.log(x)
				})
			})

			function help(recipe, client) {
				return helper.getRecipeByID(recipe.recipeID, client).then(recipeData => {
					var ingredientIDs = []
					var description = "";
					recipeData.ingredients.forEach(ing => {
						ingredientIDs.push(ing.materialID)
					})
					return helper.getMultipleMaterialsByID(client, ingredientIDs).then(materialsData => {
						for (let i = 0; i < materialsData.length; i++) {
							description += `\`${i + 1}\`${materialsData[i].name} x${recipeData.output[0].quantity}`
						}
						return Promise.resolve(description)
					})

				})
			}
		}
		if(args.length == 1 || args.length == 2){
			client.db("Discord_Game").collection("recipeData").find({ skill: "smelting" }).toArray().then(data => {
				let recipeIndex = parseInt(args[0]) - 1
				let quantity = parseInt(args[1])
				helper.createRecipe(client,player,message,data[recipeIndex].recipeID,quantity);
			})
		}
	},
};