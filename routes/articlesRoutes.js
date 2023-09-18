const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({path:path.join(__dirname, '../.env')}); //If gives error specificy the exact path
const { MONGO_URI } = process.env;

//To use bodyparser
router.use(bodyparser.json());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority' // Corrected write concern mode
    }
};

const client = new MongoClient(MONGO_URI, options);
client.connect();

//Articles Routes

//GET
//GET to retrieve all of articles array
router.get('/', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');
        //Find tracker info and store as array in trackers
        const articles = await db.collection('articles').find().toArray();

        //Send status(success) and found information
        res.status(200).json({articles:articles});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//GET to retrieve a single article by articleId
router.get('/:articleId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const articleId = req.params.articleId;

        //Find tracker info and store as array in trackers
        const foundArticle = await db.collection('articles').findOne({articleId:articleId});

        //Send status(success) and found information
        res.status(200).json({articles:foundArticle});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }

});

module.exports = router;
