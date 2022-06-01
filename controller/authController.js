const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signJWT = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

const setCookie = (res, token) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);
}


exports.signUp = async (req, res) => {
    try {
        // 1 check password and confirmpassword
        if (req.body.password != req.body.confirmPassword) {
            return res.status(201).json({
                status: 'error',
                message: 'Password and confirm Password must be same!!!'
            });
        }
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
    const passwordCheck = await user.checkPassword(req.body.password, user.password);

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


/****************************************/
// Middlewares
/***************************************/
exports.checkSubscription = async (req, res, next) => {
    if (req.user.subscription == 'basic' || req.user.subscription == 'premium' || req.user.subscription == 'cinematic' && req.user.subscriptionDuration > new Date()) {
        next();
    }
    else {
        res.status(401).render('error', {
            status: 'error',
            message: 'You dont have a valid subscription, Please Buy Subscription First',
            heading: 'Ohho...'
        });
    }
};



exports.protect = async (req, res, next) => {
    try {
        let token;
        // 1.Getting token from user and check if its there
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // for login from postman
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {       // for login from gui
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).render('error', {
                status: 'error',
                message: 'You are not logged in Please Login to get access'
            });
        }

        // 2.verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // console.log(decoded);

        // 3.check if user still exists
        const freshUser = await User.findById(decoded.id).populate('watchList').populate('reviews');
        if (!freshUser) {
            res.status(401).render('error', {
                status: 'error',
                message: 'The user belonging to token doesnt exist'
            })
        }
        // console.log(freshUser);

        res.locals.user = freshUser;
        req.user = freshUser;
        next();

    } catch (err) {
        // console.log(err);
        res.status(400).json({
            status: 'error',
            err
        })
    }
};

// check if user is logged in withour error[dont throw any error] setting user on response
exports.isLoggedIn = async (req, res, next) => {

    if (req.cookies.jwt) {
        try {
            // 1.verification token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // 2.check if user still exists
            const currentUser = await User.findById(decoded.id).populate('watchList');
            if (!currentUser) {
                return next();
            }

            res.locals.user = currentUser;
            return next();
        } catch (err) {
            console.log(err);
            return next();
        }
    }
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).render('error', {
                status: 'error',
                message: 'You do not have access to perform this action'
            });
        }
        next();
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        //Get user based on email
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'There is no account with that Email ID'
            });
        }
        //generate random token
        const resetToken = await user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        //send token to user using email
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const message = `Forgot your password, submit a patch request with uour new password and confirm password to ${resetURL} If you didnt forgot your password then please ignore.`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token (valid only for 10 minutes)',
                message
            });

            return res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            });
            // await new Email(user, resetURL).sendPasswordResetEmail();

            // res.status(200).json({
            //     status: 'success',
            //     message: 'Token sent to email'
            // });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({
                status: 'error',
                message: 'Error sending Email'
            });
        }

    } catch (err) {
        res.status(500).json({
            status: 'error'
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        // get user based on the token and check the token expire time also
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

        if (!user) {
            res.status(400).json({
                status: 'error',
                message: 'Token Invalid or expired'
            });
        }

        // set new password and reset the resetToken and resetExpire field in database
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const newToken = signJWT(user._id);

        setCookie(res, newToken);

        res.status(201).json({
            status: 'success',
            token: newToken
        });

    } catch (err) {
        next(err);
    }
};

exports.updatePassword = async (req, res, next) => {

    const user = await User.findById(req.user.id);

    if (!(await user.checkPassword(req.body.currentPassword, user.password))) {
        res.status(401).json({
            status: 'error',
            message: 'Current password is wrong'
        });
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.passwordConfirm;

    await user.save();

    const newToken = signJWT(user._id);

    setCookie(res, newToken);

    res.status(201).json({
        status: 'success',
        token: newToken
    });
};
// for updating the user after payment
// exports.setPremiumSubscription = async (req, res) => {
//     try {
//         const subscriptionName = 'premium';
//         const endingDateTime = new Date() + '';
//         const user = await User.findByIdAndUpdate(req.user.id, { subscription: subscriptionName, subscriptionDuration: endingDateTime }, { runValidators: false, new: true });
//     } catch (err) {

//     }
// };

// exports.setCinematicSubscription = (req, res) => {
//     try {
//         const subscriptionName = 'premium';
//         const endingDateTime = new Date() + '';
//         const user = await User.findByIdAndUpdate(req.user.id, { subscription: subscriptionName, subscriptionDuration: endingDateTime }, { runValidators: false, new: true });
//     } catch (err) {

//     }
// };