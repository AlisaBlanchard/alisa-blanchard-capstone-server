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


//GET
//GET to retrieve all of copy array
router.get('/', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');
        //Find tracker info and store as array in trackers
        const copy = await db.collection('copy').find().toArray();

        //Send status(success) and found information
        res.status(200).json({copy:copy});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//GET to retrieve all copy of a single sectionId
router.get('/:sectionId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const sectionId = req.params.sectionId;

        //Find tracker info and store as array in trackers
        const sectionCopy = await db.collection('copy').findOne({sectionId:sectionId});

        //Send status(success) and found information
        res.status(200).json({copy:sectionCopy});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});


module.exports = router;