const User = require('./../model/userModel');



exports.getMe = (req, res) => {
    res.status(200).json({
        name: req.user.name,
        status: 'ok'
    });
};

exports.updateMe = async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        res.status(400).json({
            status: 'error',
            message: 'Plz Use /updateMyPassword endpoint'
        });
    }
    try {
        let obBody = {};
        if (req.body.name) {
            obBody.name = req.body.name;
        }
        if (req.body.email) {
            obBody.email = req.body.email;
        }
        console.log(obBody);
        const user = await User.findByIdAndUpdate(req.user.id, obBody, { new: true, runValidators: true });
        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'Can\'t update data'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Data update successful'
        });

    } catch (err) {
        res.status(200).json({
            status: 'error',
            message: 'Some internal error'
        });
    }

};


exports.deleteMe = async (req, res, next) => {
    try {
        if (await User.findByIdAndUpdate(req.user.id, { active: false })) {
            res.status(204).json({
                status: 'success',
                user: null
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'error',
            user: null
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find().populate('watchList').populate('reviews');
        console.log(allUsers);
        if (allUsers) {
            res.status(200).json({
                status: "success",
                data: {
                    length: allUsers.length,
                    users: allUsers
                }
            });
        } else {
            res.status(200).json({
                status: "error",
                message: "error"
            });
        }
    } catch (err) {
        console.log(err);
    }

};
exports.createUser = (req, res) => {

};

exports.getUserUsingId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        if (user) {
            res.status(200).json({
                status: "success",
                data: {
                    user
                }
            });
        } else {
            res.status(200).json({
                status: "error",
                message: 'User not found!!!'
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.updateUser = (req, res) => {

};

exports.deleteUser = (req, res) => {

};

exports.buySubscription = async (req, res) => {
    try {
        const sub = await User.findByIdAndUpdate(req.user.id, { subscription: 'premium', });
        if (sub) {
            res.status(200).json({
                status: 'success',
                message: 'Subscription added Successgully'
            })
        }
    }
    catch (err) {
        console.log(err);
    }
};