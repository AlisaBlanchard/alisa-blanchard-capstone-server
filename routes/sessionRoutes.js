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


//GET to retrieve specific tracker session by trackerid and session id OR date
router.get('/:userId/:trackerId/:sessionId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const userId = req.params.userId;
        const trackerId = req.params.trackerId;
        const sessionId = req.params.sessionId;    


        //Find the user
        const userTrackers = await db.collection('sessions').find({userId:userId}).toArray();

        //Find all sessions under a trackerId
        const trackerSessions = userTrackers.filter((tracker) => tracker.trackerId == trackerId);

        //Find specific sesssion by sessionid
        const session = trackerSessions.find((session) => session.sessionId == sessionId);

        //Send status(success) and found information
        res.status(200).json({Trackers:session});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//GET to retrieve all sessions for a specific tracker by trackerid 
router.get('/:userId/:trackerId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const userId = req.params.userId;
        const trackerId = req.params.trackerId;
        // const sessionId = req.params.sessionId;    


        //Find the user
        const userTrackers = await db.collection('sessions').find({userId:userId}).toArray();
        console.log(userTrackers);
        
        //Find all sessions under a trackerId
        const trackerSessions = userTrackers.filter((tracker) => tracker.trackerId == trackerId);
        //Send status(success) and found information
        res.status(200).json({sessions: trackerSessions});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

module.exports = router;
