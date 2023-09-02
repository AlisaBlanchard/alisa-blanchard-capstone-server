const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//To use bodyparser
router.use(bodyparser.json());

//Articles Routes

//GET
//GET to retrieve all of articles array
router.get('/', (req, res) => {
    fs.readFile('./data/articles/articles.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving articles array');
        }
        res.json(JSON.parse(data));
    })
});

//GET to retrieve a single article by articleId
router.get('/:articleId', (req, res) => {
    const articleID = req.params.articleId;

    fs.readFile('./data/articles/articles.json', 'utf8', (err, data) => {
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

module.exports = router;
