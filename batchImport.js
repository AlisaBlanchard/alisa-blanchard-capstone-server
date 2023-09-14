const trackersData = require("./data/trackerData/trackerData.json");
const merchandiseData = require('./data/merchandise/merchandise.json');
const articlesData = require('./data/articles/articles.json');
const copyData = require('./data/copy/copy.json');
const usersData = require('./data/users/users.json');


const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const batchImport = async () => {
    const client = new MongoClient(MONGO_URI, options);

    try {
        await client.connect();
        const db = client.db("LifeTrackerdb");

        // Insert the data using insertMany
        const resultTrackers = await db.collection("trackers").insertMany(trackersData);
        const resultMerchandise = await db.collection("merchandise").insertMany(merchandiseData);
        const resultArticles= await db.collection("articles").insertMany(articlesData);
        const resultCopy = await db.collection("copy").insertMany(copyData);
        const resultUsers = await db.collection("users").insertMany(usersData);


        console.log(`${resultTrackers.insertedCount} documents inserted.`);
        console.log(`${resultMerchandise.insertedCount} documents inserted.`);
        console.log(`${resultArticles.insertedCount} documents inserted.`);
        console.log(`${resultCopy.insertedCount} documents inserted.`);
        console.log(`${resultUsers.insertedCount} documents inserted.`);


    } catch (err) {
        console.log(err.stack);
    } finally {
        client.close();
    }
};

batchImport();