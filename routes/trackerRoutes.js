const { MongoClient } = require('mongodb');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({path:path.join(__dirname, '../.env')}); //If gives error specificy the exact path
const { MONGO_URI } = process.env;

//Tracker Routes

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
//GET to retrieve full trackerData array
router.get('/', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');
        //Find tracker info and store as array in trackers
        const trackers = await db.collection('Trackers').find().toArray();

        //Send status(success) and found information
        res.status(200).json({Trackers:trackers});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//GET to retrieve all trackers & info associated with a specific userId
router.get('/:userId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const userId = req.params.userId;

        //Find tracker info and store as array in trackers
        const trackers = await db.collection('trackers').findOne({userId:userId});
        console.log({trackers});

        //Send status(success) and found information
        res.status(200).json({Trackers:trackers});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});


//GET to retrieve specific tracker by tracker id
router.get('/:userId/:trackerId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const trackerId = req.params.trackerId;

        //Find tracker info and store as array in trackers
        const tracker = await db.collection('trackers').findOne({trackerId:trackerId});

        //Send status(success) and found information
        res.status(200).json({Trackers:tracker});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//GET to retrieve specific tracker session by trackerid and session id OR date
router.get('/:userId/:trackerId/:sessionId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const trackerId = req.params.trackerId;
        const sessionId = req.params.sessionId;    


        //Find tracker by trackerId 
        const foundTracker = await db.collection('trackers').findOne({trackerId:trackerId});
        
        //Find session in foundTracker array by sessionId 
        const session = foundTracker.find((session) => session.sessionId == sessionId);

        //Send status(success) and found information
        res.status(200).json({Trackers:session});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});




//POST

//PUT

//DELETE

module.exports = router;
