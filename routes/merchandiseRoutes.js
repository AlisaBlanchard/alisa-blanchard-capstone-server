const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//To use bodyparser
router.use(bodyparser.json());

//GET
//GET to retrieve full Merchandise array
router.get('/', (req, res) => {
    fs.readFile('./data/merchandise/merchandise.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving merchandise information');
        }
        res.json(JSON.parse(data));
    })
});


//GET to retrieve single merchandise object
router.get('/:itemId', (req, res) => {
    const itemID = req.params.itemId;

    fs.readFile('./data/merchandise/merchandise.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving item');
        }
        //Store full array 
        const items = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const foundItem = items.find((item) => item.itemId == itemID);

        res.json(foundItem);
    });
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