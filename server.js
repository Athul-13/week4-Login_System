const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const router = require('./router');
const nocache = require('nocache');
const { title } = require('process');
const app = express();

const port = process.env.PORT || 3000;

// Set up cache-control headers to prevent caching
app.use((req, res, next) => {
   res.setHeader('Cache-Control','no-store');
   next();
});

app.use(nocache())

// Set up body-parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// Load static assets
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// Set up session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

// Load router
app.use('/route', router);

// Home route
app.get('/', (req, res) => {
   if(req.session.user) {
       res.redirect('/route/dashboard');
   } else {
       const error = req.query.error || null;
       const logout = req.query.logout === 'success' ? 'Logout successful' : null;
       res.setHeader('Cache-Control', 'no-store');
       res.render('base', { title: "login page", error, logout });
   }
});

// 404 for other URLs
app.use('*', (req,res) => {
    res.status(404).render('error', {title: '404 - Page Not Found'});
});

// Start the server
app.listen(port, () => {
    console.log('This server is working on http://localhost:3000');
});