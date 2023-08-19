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
        const foundSection = items.find((obj) => obj.sectionId == sectionID);

        res.json(foundSection);
    });
});

//GET to retrieve all of articles array
router.get('/articles', (req, res) => {
    fs.readFile('./data/copy/articles.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving articles array');
        }
        res.json(JSON.parse(data));
    })
});

//GET to retrieve a single article by articleId
router.get('/articles/:articleId', (req, res) => {
    const articleID = req.params.articleId;

    fs.readFile('./data/copy/copy.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving articles array');
        }
        //Store full array 
        const articles = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const foundArticle = articles.find((article) => article.articleId == articleID);

        res.json(foundArticle);
    });
});

