const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//To use bodyparser
router.use(bodyparser.json());

//GET
//GET to retrieve all of copy array
router.get('/', (req, res) => {
    fs.readFile('./data/copy/copy.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving copy array');
        }
        res.json(JSON.parse(data));
    })
});

//GET to retrieve all copy of a single sectionId
router.get('/:sectionId', (req, res) => {
    const sectionID = req.params.sectionId;

    fs.readFile('./data/copy/copy.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving copy array');
        }
        //Store full array 
        const copyArray = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const foundSection = copyArray.find((obj) => obj.sectionId == sectionID);

        res.json(foundSection);
    });
});


module.exports = router;