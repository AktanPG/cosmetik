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
    res.render('index', {
        products: [
            {
                title: "New collection pamada",
                images: ['https://pics.ru/wp-content/uploads/2016/06/gloss4.jpg'],
                cost: "399"
            },
            {
                title: "Biotherm - Blue Therapy Red",
                images: ['https://cosmeticall.com.ua/store/pub/media/catalog/product/cache/image/700x560/5eabe8d3362c0fa2bcd1ca09df4e84f2/c/u/cua22078676701.jpg'],
                cost: "699"
            },
            {
                title: "Tush from israel",
                images: ['https://venalia.ru/media/catalog/product/cache/1/small_image/516x490/9df78eab33525d08d6e5fb8d27136e95/s/c/sch01-seacare-spa-_mineral-mud-shampoo-for-all-hair-types-400-ml__1.jpg'],
                cost: "120"
            },
            {
                title: "Parfem",
                images: ['https://kosmet.by/files/products/127_1.600x600.jpg?da2adafcc569be76e783a25ddb3d94b0'],
                cost: "2499"
            },
            {
                title: "Shapmoo for kids",
                images: ['http://www.nsp-business.com.ua/i/bremani/care1.jpg'],
                cost: "799"
            }
        ]
    });
});

app.use('/', require('./routes/auth'));

app.listen(process.env.PORT || 5000, (err) => {
    if(err) console.log(err);
    console.log('__[ Server started ]__');
});