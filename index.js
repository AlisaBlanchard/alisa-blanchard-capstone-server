const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const usersRoutes = require('./routes/usersRoutes');
const merchandiseRoutes = require('./routes/merchandiseRoutes');
const copyRoutes = require('./routes/copyRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const articleRoutes = require('./routes/articlesRoutes');


//Middleware

//CORS
app.use(cors());

// require("dotenv").config();
// const { PORT, CORS_ORIGIN } = process.env;


//To work with req.body
app.use(express.json());

//To use Public folder to serve static images
app.use(express.static('public'));

// //To use routes
app.use('/users', usersRoutes);
app.use('/merchandise', merchandiseRoutes);
app.use('/copy', copyRoutes);
app.use('/trackers', trackerRoutes);
app.use('/articles', articleRoutes);





//End Points

//GET
app.get('/', (req, res) => {
  res.send('Welcome to my API!')
});

//Port
app.listen(5050, () => {
  console.log('App is running at http://localhost:5050');
});