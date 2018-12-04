const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect('mongodb://creater:asdfasdfasdf123@ds111895.mlab.com:11895/cosmetic-place',{
    useNewUrlParser: true
}, (err) => {
    if(err) return console.log(err);
    console.log('__[ Connected MongoDB ]__');
});

const app = express();

app.set('view engine', 'ejs');
app.use('/assets/', express.static(path.resolve(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: require('./keys').jwtKey
}));

app.use('/', (req, res, next) => {
    
    if(!req.session.token && req.path !== '/login' && req.path !== '/signup') {
        res.redirect('/login');
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/', require('./routes/auth'));

app.listen(process.env.PORT || 5000, (err) => {
    if(err) console.log(err);
    console.log('__[ Server started ]__');
});