// const express = require('express');
// const cors = require('cors');
// const app = express();
// const fs = require('fs');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require('passport');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');


// //Middleware

// //CORS
// // app.use(cors());
// const allowedOrigins =['http://localhost', 'http://localhost:3000']; //Add other origins as needed
// const corsOptions = {
//     origin: allowedOrigins,
//     credentials: true, //Allow credentials (cookies, headers, etc.)

//   }

// app.use(cors(corsOptions));
// app.use(cookieParser());
// app.use(
//     session({
//         secret: 'your-secret-key',
//         resave: false,
//         saveUninitialized: true,
//         cookie: {
//             maxAge: 500000, // (in milliseconds)
//           },
//     })
// );
// app.use(passport.initialize());
// app.use(passport.session());





// // Google OAuth Configuration
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: '217618555359-p3mmm999cumt3blg5267fufbdn1a81p9.apps.googleusercontent.com',
//             clientSecret: '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',
//             callbackURL: 'http://localhost:5050/auth/google/redirect',
//         },
//         (accessToken, refreshToken, profile, done) => {
//             // Store user information in your database or session.
//             return done(null, profile);
//         }
//     )
// );


// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });



// // Routes
// app.get('/', (req, res) => {
//   res.send('Welcome to my API!')
// });

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//     '/auth/google/redirect',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         // Successful authentication, redirect to the frontend app.
//         res.redirect('http://localhost:3000');
//     }
// );

// app.get('/user', (req, res) => {
//     // Return user information (if authenticated) or an error message.
//     console.log(req);
//     if (req.isAuthenticated()) {
//         res.json({ user: req.user });
//     } else {
//         res.status(401).json({ error: 'Not authenticated' });
//     }
// });

// app.get('/logout', (req, res) => {
//     // Log out the user and redirect to the frontend.
//     req.logout((err) => {
//         if (err) {
//             console.error(err);
//         }
//         res.redirect('http://localhost:3000'); // Replace with your frontend URL
//         res.send({redirect:true})
//     });
// });


// //Port
// app.listen(5050, () => {
//   console.log('App is running at http://localhost:5050');
// });

// server.js

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const usersRoutes = require('./routes/usersRoutes');
const merchandiseRoutes = require('./routes/merchandiseRoutes');
const copyRoutes = require('./routes/copyRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const articleRoutes = require('./routes/articlesRoutes');
require('dotenv');



const app = express();

// Middleware
const allowedOrigins = ['http://localhost:3000']; // Add other origins as needed
const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Allow credentials (cookies, headers, etc.)
};
app.use(cors(corsOptions));

//To work with req.body
app.use(express.json());

//To use routes
app.use('/users', usersRoutes);
app.use('/merchandise', merchandiseRoutes);
app.use('/copy', copyRoutes);
app.use('/trackers', trackerRoutes);
app.use('/articles', articleRoutes);

// //To use Public folder to serve static images
app.use(express.static('public'));




app.use(cookieParser());
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 500000, // (in milliseconds)
          },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Configuration
passport.use(
    new GoogleStrategy(
        {
            clientID: '202998095993-qj92550c2un8c7i5mp399nm73osnmr1e.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:5050/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Store user information in your database or session.
            // console.log(profile);
            
            //New User object that gets its information from google log in
            const newUser = {
                userId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails,
                profPic: profile.photos
            };


            fetch('http://localhost:5050/users', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(newUser)
            }) 
            .then(res => res.json()) 
            .then(data => {
                console.log(data);

            })
            .catch(error => {
                console.log(error);
            })

            // console.log(newUser);

            return done(null, profile);
        }
    )
);

// callBack
// OAuth: clientId, clientSecret



passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to the frontend app.
        res.redirect('http://localhost:3000/');
    }
);

app.get('/user', (req, res) => {
    // Return user information (if authenticated) or an error message.
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.get('/logout', (req, res) => {
    // Log out the user and redirect to the frontend.
    req.logout((err) => {
        if (err) {
            console.error(err);
        }
        // res.redirect('http://localhost:3000'); // Replace with your frontend URL
        res.send({redirect:true})
    });
});

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
