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
    const client = new MongoClient(uri);

    try {
        await client.connect();
        //await listDatabases(client);
        //await createListing(client, newListing)
        //awaitfindOneListingByName(client, 'TestName');
        //await updateListingByName(client, 'TestName', {Level: 200});
        //await findOneListingByName(client,'TestName');
        await addTitle(client,"Noob", "common", "Earned for being a big noob")
        //await addField(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

async function addItemTest(client){
    
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

async function addTitle(client, name, rarity, description){
    var data = {
        titleID: 10,
        name: name,
        rarity: rarity,
        description: description
    }
    await client.db("Discord_Game").collection("titleData").insertOne(data);
}

async function addField(client) {

    result = await client.db("Discord_Game").collection("playerData").updateMany({},{$set: {setTitleID: null, titles: []}});
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
    /*
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
                }
    
            }
        }
        */
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


main().catch(console.error);

