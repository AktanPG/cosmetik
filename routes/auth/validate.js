const emailProviders = require('email-providers');

function createMassage (register, res, massage, body) {
    if(register) {
        res.render('pages/signup', {error: massage, ...body})
    } else {
        res.render('pages/login', {error: massage, ...body})
    }
}

module.exports.checkEmail = (email, res, register, body) => {
    if(email.indexOf('@') > -1) {
        const value = email.split('@')[0];
        const provider = email.split('@')[1];

        if(value.length < 1) {
            createMassage(register, res, 'Invalid email', body);
            return false;
        }  else {
            for(let i = 0; i < emailProviders.length; i++) {
                if(emailProviders[i] === provider) {
                    return true
                }
            }

            createMassage(register, res, 'Invalid email', body);
            return false;
        }
    } else {
        createMassage(register, res, 'Invalid email', body);
    }
}

module.exports.checkPassword = (password, res, register, body) => {
    if(password.length < 6) {
        createMassage(register, res, 'Password must be at least 6 characters', body)
    } else {
        return true;
    }
}

module.exports.checkName = (name, res, register, body) => {
    if(name.length < 5) {
        createMassage(register, res, 'Name must be at least 5 characters', body)
    } else {
        return true;
    }
}