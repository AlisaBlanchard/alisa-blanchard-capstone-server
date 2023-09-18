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
        const sessions = await db.collection('sessions').find().toArray();

        //Send status(success) and found information
        res.status(200).json({sessions:sessions});
        
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

//POST
//POST to add new session to sessions collection
router.post('/', async (req, res) => {
    try{    
        const {sessionData} = req.body;
        // console.log(sessionData);   
        
        const userId = sessionData.userId;
        const trackerName = sessionData.trackerName;
        const trackerId = sessionData.trackerId;

        // New Tracker object
        const newSession ={
            userId: userId,
            trackerId: trackerId,
            sessionId: uuidv4(),
            tracker_name: trackerName,
            date: new Date(),
            data: [
                {
                    label: sessionData.label1,
                    method: sessionData.method1,
                    value: sessionData.value
                },
                {
                    label: sessionData.label2,
                    method: sessionData.method2,
                    value: sessionData.value
                },
                {
                    label: sessionData.label3,
                    method: sessionData.method3,
                    value: sessionData.value
                },
                {
                    label: sessionData.label4,
                    method: sessionData.method4,
                    value: sessionData.value
                }
            ]
        };

        console.log(newSession);

        const db = client.db('LifeTrackerdb');

        // console.log(newTracker);

        //Check if there is already a user object with provided userId
        const foundSession = await db.collection('sessions').findOne({sessionId: sessionId});

        console.log(foundSession);
        
        //If Session name already exists, send error message
        if (foundSession) {
            res.status(409).json({error:'Session Already Exists'});
        } else {
            //
            const session = await db.collection('sessions').insertOne(newSession);
            console.log(session); 

            //Send status(success) and found information
            res.status(200).json(session);
        }
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});


module.exports = router;
