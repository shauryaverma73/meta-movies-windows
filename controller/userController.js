const User = require('./../model/userModel');



exports.getMe = (req, res) => {
    res.status(200).json({
        name: req.user.name,
        status: 'ok'
    });
};

exports.updateMe = async (req, res, next) => {
    // if (req.body.password || req.body.confirmPassword) {
    //     return res.status(400).json({
    //         status: 'error',
    //         message: 'Plz Use /updateMyPassword endpoint'
    //     });
    // }
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
            return res.status(401).json({
                status: 'error',
                message: 'Can\'t update data'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Data update successful'
        });

    } catch (err) {
        return res.status(200).json({
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

exports.updateUser = async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Can\'t update data'
            });
        }
        console.log(user);
        return res.status(200).json({
            status: 'success',
            message: 'Data update successful'
        });

    } catch (err) {
        console.log(err);
        return res.status(200).json({
            status: 'error',
            message: 'Some internal error'
        });
    }

};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { runValidators: false });
        if (user) {
            res.status(204).json({
                status: 'success',
                message: 'User Account Deactivated'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'error',
            user: null
        });
    }
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

exports.addToWatchList = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // get movie id from parameters
        const check = user.watchList.includes(req.params.movieId);
        if (check) {
            res.status(200).json({
                status: 'success',
                message: 'Movie already in watchlist.'
            });
        } else {
            user.watchList.push(req.params.movieId);
            const addedUser = await user.save({ validateBeforeSave: false, new: true });
            res.status(200).json({
                status: 'success',
                message: 'Movie added to watchlist.'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(201).json({
            status: 'error',
            message: 'Can\'t add movie to watchlist'
        });
    }
};

exports.removeFromWatchList = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let newList = [];
        user.watchList.forEach((el) => {
            if (el != req.params.movieId) {
                newList.push(el);
            }
        });
        user.watchList = newList;
        await user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'Review Deleted Successfully'
        });
    } catch (err) {
        res.status(201).json({
            status: 'error',
            message: 'Can\'t remove movie from watchlist'
        });
    }
};