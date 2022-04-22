const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');

const signJWT = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

const setCookie = (res, token) => {
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);
}


exports.signUp = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });
        if (newUser) {

            const token = signJWT(newUser.id);

            setCookie(res, token);

            res.status(201).json({
                status: 'success',
                token: token,
                data: {
                    user: newUser
                }
            });
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Signup unsuccessful',
                error: err.body
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.login = async (req, res) => {

    //1. check if email and password entered/exist
    if (!req.body.email || !req.body.password) {
        return res.status(201).json({
            status: 'error',
            message: 'Email or Password can\'t be empty'
        });
    }

    // 2.Check if user exists and password is correct
    const user = await User.findOne({ email: req.body.email });
    const passwordCheck = await User.checkPassword(req.body.password, user.password);

    if (!user || !passwordCheck) {
        return res.status(401).json({
            status: 'error',
            message: 'Email ID or password incorrect'
        });
    }

    // 3. If everything is ok then send token
    const token = signJWT(user.id);

    setCookie(res, token);

    res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
};

exports.logout = (req, res) => {
    try {
        res.cookie('jwt', 'loggedout', {
            expiresIn: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            status: 'success',
        });

    } catch (err) {
        console.log('Error Logging out');
    }
};


/*************************************** */

exports.checkSubscription = async (req, res, next) => {
    if (req.user.subscription == 'premium') {
        next();
    }
    // else part
};
