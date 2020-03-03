const {MongoClient} = require('mongodb');

const newListing = {
    name: 'TestName',
    Level: 100,
    Bathrooms: 1
}

async function main(){

//#region URI
const uri = 'mongodb+srv://Syrus:Raptor66!@cluster0-ddkdn.mongodb.net/test?retryWrites=true&w=majority';
//#endregion
const client = new MongoClient(uri);

try{
    await client.connect();
    //await listDatabases(client);
    //await createListing(client, newListing)
    //awaitfindOneListingByName(client, 'TestName');
    //await updateListingByName(client, 'TestName', {Level: 200});
    //await findOneListingByName(client,'TestName');
    await addField(client);
}catch(e){
    console.error(e);
}finally{
    await client.close();
}

}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createListing(client, newListing){
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

async function addField(client){
    result = await client.db("Discord_Game").collection("playerData").updateMany({},{$set: {class: 'fighter', race: 'human'}});
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


main().catch(console.error);

