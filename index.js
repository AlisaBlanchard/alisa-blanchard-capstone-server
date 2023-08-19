const express = require('express');
const cors =require('cors');
const app = express();
const fs = require('fs');
// const router = express.Router();
// const usersRoutes = require('./routes/usersRoutes');
// const merchandiseRoutes = require('./routes/merchandiseRoutes');
// const copyRoutes = require('./routes/copyRoutes');

//Middleware

//CORS
app.use(cors());

//To work with req.body
app.use(express.json());

//To use Public folder to serve static images
app.use(express.static('public'));

// //To use routes
// app.use('/users', usersRoutes);
// app.use('/merchandise', merchandiseRoutes);
// app.use('/copy', copyRoutes);





//End Points

//GET
app.get('/', (req, res) => {
  res.send('Welcome to my API!')
});

//Port
app.listen(5050, () => {
  console.log('App is running at http://localhost:5050');
});