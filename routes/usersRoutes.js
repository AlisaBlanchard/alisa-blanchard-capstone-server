const express = require('express');
const router = express.Router();
const fs = require('fs');
const bodyparser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//To use bodyparser
router.use(bodyparser.json());

//GET
//GET full users array
router.get('/', (req, res) => {
    fs.readFile('./data/users/users.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving user infromation');
        }
        res.json(JSON.parse(data));
    })
});

//GET a single user's information
router.get('/:userID', (req, res) => {
    const userID = req.params.userID;

    fs.readFile('./data/users/users.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving user with id' + userID_);
        }
        //Store full array 
        const users = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const foundUser = users.find((user) => user.userId == userID);

        res.json(foundUser);
    });
});

//POST
//POST to add new user to users array
router.post('/', (req, res) => {
    fs.readFile('./data/users/users.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving user infromation');
        }
        const users = JSON.parse(data);

        const id = uuidv4();

        //Create new user object
        const newUser = {
            userId: id,
            username: req.body.username,
            name: req.body.name,
            birthdate: req.body.birthdate,
            tracking_sessions: 0
        }

        users.push(newUser);

        fs.writeFile('./data/users/users.json', (users), (err) => {
            if(err) {
                console.log(err);
            }});

            res.send('New user added');

    })
})


//PUT
//PUT to update the user information of a specific user
router.put('/:userId', (req, res) => {
    const userID = req.params.userID;

    fs.readFile('./data/users/users.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving user infromation');
        }
        //Store full array 
        const users = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const foundUser = users.find((user) => user.userId == userID);

        // res.json(foundUser);
    

        fs.writeFile('./data/users/users.json', (foundUser), (err) => {
            if(err) {
                console.log(err);
            }});

            res.send('User information updated');
    });
});

//DELETE
//DELETE to remove user from users array
router.delete('/:userId', (req, res) => {
    const userID = req.params.userID;

    fs.readFile('./data/users/users.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return res.send('Error retrieving user information');
        }
        //Store full array
        const users = JSON.parse(data);

        //If userId in array is == userId from URL, send that user's data
        const foundUser = users.find((user) => user.userId == userID);


    });

    res.send('User deleted sucessfully');

})