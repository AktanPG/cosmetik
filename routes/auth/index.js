const router = require('express').Router();
const {checkEmail, checkPassword, checkName} = require('./validate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../../models/users');

router.get('/login', (req, res) => {
    res.render('pages/login', {
        error: false,
        email: '', password: ''
    });
});

router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    if(checkEmail(email, res, false, req.body) && 
    checkPassword(password, res, false, req.body)) {

        try {
            
            const user = await Users.findOne({email});

            if(!user) {
                res.render('pages/login', {error: 'Email does not exist'}, ...req.body);
            } else {

                const isMatch = bcrypt.compareSync(password, user.password);

                if(isMatch) {
                    const token = jwt.sign({id: user._id, admin: false}, require('../../keys').jwtKey);

                    req.session.token = token;

                    res.redirect('/');
                } else {
                    res.render('pages/login', {error: 'Inccorect password', ...req.body});
                }

            }

        } catch(error) {
            console.log(error);
            res.render('pages/login', {error: 'Error, try again later', ...req.body});
        }
    }
});

router.get('/signup', (req, res) => {
    res.render('pages/signup', {
        error: false,
        name: '',
        email: '',
        password: ''
    });
});

router.post('/signup', async(req, res) => {
    const {name, email, password} = req.body;
    console.log(req.body);

    if(checkName(name, res, true, req.body) && 
        checkEmail(email, res, true, req.body) && 
        checkPassword(password, res, true, req.body)) {
        try {
            const user = await Users.findOne({email});

            if(!user) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);

                try {
                    
                    const newUser = await new Users({name, email, password: hashedPassword}).save();

                    res.redirect('/login');

                } catch (error) {
                    console.log(error);
                    res.render('pages/signup', {error: 'Error, try again later', ...req.body});
                }
            } else {
                res.render('pages/signup', {error: 'Email already exist', ...req.body});
            }
        } catch (error) {
            console.log(error);
            res.render('pages/signup', {error: 'Error, try again later', ...req.body});
        }
    }

});

module.exports = router;