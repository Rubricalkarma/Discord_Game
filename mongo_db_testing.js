const { MongoClient } = require('mongodb');

const newListing = {
    name: 'TestName',
    Level: 100,
    Bathrooms: 1
}


async function main() {

    //#region URI
    const uri = 'mongodb+srv://Syrus:Raptor66!@cluster0-ddkdn.mongodb.net/test?retryWrites=true&w=majority';
    //#endregion
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    var ing = [{materialID: 1, quantity: 3},{materialID: 3, quantity: 2}]

    try {
        await client.connect();
        //await listDatabases(client);
        //await createListing(client, newListing)
        //awaitfindOneListingByName(client, 'TestName');
        //await updateListingByName(client, 'TestName', {Level: 200});
        //await findOneListingByName(client,'TestName');
        //await addTitle(client, "Lørd", "unique", "Earned for being Jordan Pond")
        //await addMaterial(client, "Small Rock", "common", "A small rock found while mining", 2, "", "mining")
        //await addMaterial(client, "Bronze Bar", "uncommon", "A bar of bronze", 40, "", "smelting")
        await addRecipe("Cat Rock = Bronze", ing, [{materialID: 5, quantity: 1}], 'smelting',1, client)
        //await test(client);
        //await addField(client);
    } catch (e) {
        console.error(e);
    } finally {
        //await client.close();
    }

}

async function test(client){
    client.db("Discord_Game").collection("recipeData").updateOne({recipeID: 1},{
        $set:{
            cost: 3
        }
    })
}



async function addRecipe(name, ingredients,output,skill,cost,client) {
    var data = {
        recipeID: 2,
        name: name,
        ingredients: ingredients,
        output: output,
        skill: skill,
        cost: cost
    }
    await client.db("Discord_Game").collection("recipeData").insertOne(data)
}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByName(client, nameOfListing) {
    result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing }
    );

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
async function updateListingByName(client, nameOfListing, updatedListing) {
    result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

function getMaxTitleID(client) {
    /*
    return client.db("Discord_Game").collection("titleData").find({}).sort({titleID: -1}).limit(1).toArray().then(results =>{
        console.log(results[0].titleID)
        return results[0].titleID;
    })
    */

    return new Promise(function (resolve, reject) {
        client.db("Discord_Game").collection("titleData").find({}).sort({ titleID: -1 }).limit(1).toArray(function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function addMaterial(client, name, rarity, description, sellPrice, emoji, skill) {

    client.db("Discord_Game").collection("materialData").find({}).sort({ materialID: -1 }).limit(1).toArray().then(result => {
        console.log(result[0].materialID + 1);
        var data = {
            materialID: result[0].materialID + 1,
            name: name,
            rarity: rarity,
            description: description,
            sellPrice: sellPrice,
            emoji: emoji,
            skill: skill
        }

        client.db("Discord_Game").collection("materialData").insertOne(data)

    })


}
function addTitle(client, name, rarity, description) {

    getMaxTitleID(client).then(max => {
        //console.log(max[0]);
        var data = {
            titleID: max[0].titleID + 1,
            name: name,
            rarity: rarity,
            description: description
        }
        client.db("Discord_Game").collection("titleData").insertOne(data);
    })





}

async function addField(client) {

    //result = await client.db("Discord_Game").collection("playerData").updateMany({discordID: '223509189509513216'}, { $set: { titles: [] } });
    /*
    result = await client.db("Discord_Game").collection("playerData").updateMany({},
        {$set: {
            skills:{
                mining:{
                    emote: ":pick:",
                    level: 1,
                    experience: 0
                },
                foraging:{
                    emote:":herb:",
                    level: 1,
                    experience: 0
                },
                fishing:{
                    emote:":fishing_pole_and_fish:",
                    level: 1,
                    experience: 0
                }
            }
        }
    });
    */
    /*
    result = await client.db("Discord_Game").collection("TEST_ITEMS").insertMany(
        [{
            name: 'banana',
            itemID: 1,
            value: 10
        },
        {
            name: 'orange',
            itemID: 2,
            value: 20
        },
        {
            name: 'apple',
            itemID: 3,
            value: 30
        }]
    )
        */
    
    result = await client.db("Discord_Game").collection("playerData").updateMany({}, {
        $set: {
            skills: {
                mining:{
                    emote: ":pick:",
                    level: 1,
                    experience: 0
                },
                foraging:{
                    emote:":herb:",
                    level: 1,
                    experience: 0
                },
                fishing:{
                    emote:":fishing_pole_and_fish:",
                    level: 1,
                    experience: 0
                },
                summoning:{
                    emote:":crystal_ball:",
                    level: 1,
                    experience: 0
                },
                smelting:{
                    emote:":fire:",
                    level: 1,
                    experience: 0
                }
            }
        }
    })
        
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


main().catch(console.error);

