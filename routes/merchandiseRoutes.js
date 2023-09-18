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
//GET to retrieve full Merchandise array
router.get('/', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');
        //Find tracker info and store as array in trackers
        const merchandise = await db.collection('merchandise').find().toArray();

        //Send status(success) and found information
        res.status(200).json({merchandise:merchandise});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});


//GET to retrieve single merchandise object
router.get('/:itemId', async (req, res) => {
    try{      
        const db = client.db('LifeTrackerdb');

        const itemId = req.params.itemId;

        //Find tracker info and store as array in trackers
        const foundItem = await db.collection('merchandise').findOne({itemId:itemId});
        console.log({foundItem});

        //Send status(success) and found information
        res.status(200).json({merchandise:foundItem});
        
    }catch(error){
        res.status(500).json({error:error.message});
    }
});


//PUT
//PUT to update a single merchandise object's quantity
router.put('/:itemId', (req, res) => {
    const itemID = req.params.itemId;

    fs.readFile('./data/merchandise/merchandise.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving item information');
        }
        //Store full array 
        const items = JSON.parse(data);

        //If itemId in array is == itemId from URL, send that item's data
        const foundItem = items.find((item) => item.itemId == itemID);

        res.send(foundItem.quantity);

        fs.writeFile('./data/merchandise/merchandise.json', (foundItem.quantity), (err) => {
            if(err) {
                console.log(err);
            }});

            res.send('item quantity updated');
    });
});
module.exports = router;