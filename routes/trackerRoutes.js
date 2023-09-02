const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//Tracker Routes

//To use bodyparser
router.use(bodyparser.json());

//GET
//GET to retrieve full trackerData array
router.get('/', (req, res) => {
    fs.readFile('./data/trackerData/trackerData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving tracker information');
        }
        res.json(JSON.parse(data));
    })
});

//GET to retrieve all trackers & info associated with a specific userId
router.get('/:userId', (req, res) => {
    const userID = req.params.userId;

    fs.readFile('./data/trackerData/trackerData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving tracker information');
        }
        //Store full array 
        const users = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const {foundUser} = users.find((user) => user.userId == userID);

        res.json(foundUser);
    })
});


//GET to retrieve specific tracker by tracker id
router.get('/:userId/:trackerId', (req, res) => {
    const trackerID = req.params.trackerId;

    fs.readFile('./data/trackerData/trackerData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving tracker information');
        }
        //Store full array 
        const trackers = JSON.parse(data);

        //If trackerId in array is == trackerId from URL, send that tracker's data
        const foundTracker = trackers.find((tracker) => tracker.trackerId == trackerID);

        res.json(foundTracker);
    })
});

//GET to retrieve specific tracker session by trackerid and session id OR date
router.get('/:userId/:trackerId/:sessionId', (req, res) => {
    const trackerID = req.params.trackerId;
    const sessionID = req.params.sessionId;

    
    fs.readFile('./data/trackerData/trackerData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving tracker information');
        }
        //Store full array 
        const trackers = JSON.parse(data);

        //If trackerId in array is == trackerId from URL, send that tracker's data
        const {foundTracker} = trackers.find((tracker) => tracker.trackerId == trackerID);

        const foundSession = foundTracker.sessions.find((session) => session.sessionId == sessionID);


        res.json(foundSession);
    })
});




//POST

//PUT

//DELETE

module.exports = router;
