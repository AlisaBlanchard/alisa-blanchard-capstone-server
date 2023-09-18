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
//GET full users array
router.get('/', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');
        //Find tracker info and store as array in trackers
        const users = await db.collection('users').find().toArray();
        console.log(users); 

        //Send status(success) and found information
        res.status(200).json({users:users});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }

});

//GET a single user's information
router.get('/:userId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const userId = req.params.userId;

        //Find tracker info and store as array in trackers
        const users = await db.collection('users').findOne({userId:userId});
        console.log(users); 

        //Send status(success) and found information
        res.status(200).json({users:users});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//POST
//POST to add new user to users array
router.post('/', async (req, res) => {
    try{    
        const newUser = req.body;
        // console.log(req.body);

        const db = client.db('LifeTrackerdb');
        const userId = newUser.userId;
        // console.log(newUser);


        //Check if there is already a user object with provided userId
        const foundUser = await db.collection('users').findOne({userId:userId});
        // console.log(foundUser);
        
        //If user already exists, send error message
        if (foundUser) {
            res.status(409).json({error:'User Already Exists'});
        } else {
            //
            const user = await db.collection('users').insertOne(newUser);
            console.log(user); 

            //Send status(success) and found information
            res.status(200).json(user);
        }
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
})


module.exports = router;