const User = require('./../model/userModel');



exports.getMe = (req, res) => {
    res.status(200).json({
        name: req.user.name,
        status: 'ok'
    });
};

exports.updateMe = (req, res) => {

};

// exports.deleteMe = (req, res) => {

// };


exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(204).json({
            status: 'success',
            user: null
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
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
        console.log(req.user);
        if (user) {
            res.status(200).json({
                status: "success",
                data: {
                    user
                }
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