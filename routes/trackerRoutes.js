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
        const trackers = await db.collection('trackers').find().toArray();

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
        const userTrackers = await db.collection('trackers').find({userId:userId}).toArray();
        // console.log({trackers});

        //Send status(success) and found information
        res.status(200).json({trackers:userTrackers});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});


//GET to retrieve specific tracker by tracker id
router.get('/:userId/:trackerId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const trackerId = req.params.trackerId;
        const userId = req.params.userId;


        //Find the user
        const userTrackers = await db.collection('trackers').find({userId:userId}).toArray();
        // console.log(userTrackers);

        //Find tracker info and store as array in trackers
        const foundTracker = userTrackers.find((tracker) => tracker.trackerId == trackerId);
        

        //Send status(success) and found information
        res.status(200).json({trackers:foundTracker});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});




//GET to get all sessions for one users specfic tracker




//POST
//POST to add new tracker to trackers array within the Trackers collection document
router.post('/', async (req, res) => {
    try{    
        const {test} = req.body;
        // console.log(test);   
        
        const userId = test.userId;
        const trackerName = test.trackerName;

        // New Tracker object
        const newTracker ={
            userId: userId,
            trackerId: uuidv4(),
            tracker_name: trackerName,
            template: [
                {
                    label: test.label1,
                    method: test.method1,
                    value: 0
                },
                {
                    label: test.label2,
                    method: test.method2,
                    value: 0
                },
                {
                    label: test.label3,
                    method: test.method3,
                    value: 0
                },
                {
                    label: test.label4,
                    method: test.method4,
                    value: 0
                }
            ]
        };

        console.log(newTracker);

        const db = client.db('LifeTrackerdb');

        // console.log(newTracker);

        //Check if there is already a user object with provided userId
        const foundTracker = await db.collection('trackers').findOne({tracker_name: trackerName});

        console.log(foundTracker);
        
        //If tracker name already exists, send error message
        if (foundTracker) {
            res.status(409).json({error:'Tracker Already Exists'});
        } else {
            //
            const tracker = await db.collection('trackers').insertOne(newTracker);
            console.log(tracker); 

            //Send status(success) and found information
            res.status(200).json(tracker);
        }
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

// //POST to add new session data to sessions 
// router.post('/', async (req, res) => {
//     try{    
//         const newTracker = req.body;
//         // console.log(req.body);

//         const db = client.db('LifeTrackerdb');

//         const userId = newTracker.userId;
//         const trackerName = newTracker.tracker_name;

//         // console.log(newTracker);


//         //Check if there is already a user object with provided userId
//         const foundUser = await db.collection('trackers').findOne({userId:userId});
//         const foundTracker = foundUser.find((tracker) => tracker.tracker_name == trackerName);

//         // console.log(foundUser);
        
//         //If tracker name already exists, send error message
//         if (foundTracker) {
//             res.status(409).json({error:'User Already Exists'});
//         } else {
//             //
//             const tracker = await db.collection('trackers').insertOne(newTracker);
//             console.log(tracker); 

//             //Send status(success) and found information
//             res.status(200).json(tracker);
//         }
        
//     }catch(error){
//         res.status(500).json({error:error.message});
//     }
// });

//PUT

//DELETE

module.exports = router;
