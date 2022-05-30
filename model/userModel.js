const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email Id is Required.'],
        validate: [validate.isEmail, 'Enter Correct Email Id'],
        lowercase: true
    },
    role: {
        type: String,
        required: [true, 'A role must be assigned'],
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A password is must.'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'A confirm password is must.'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password not same'
        }
    },
    profilePicture: {
        type: String,
        default: 'default.jpg'
    },
    passwordResetExpires: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    subscription: {
        type: String,
        default: 'basic',
        enum: ['basic', 'premium', 'cinematic']
    },
    subscriptionDuration: {
        type: Date
    },
    watchList: [
        {
            type: [mongoose.Schema.ObjectId],
            ref: 'Movie'
        }
    ],
    reviews: [
        {
            type: [mongoose.Schema.ObjectId],
            ref: 'Review'
        }
    ]
});

// encrypt user password before save
userSchema.pre('save', async function (next) {

    // if the password has been modified or new password is being created then
    // hashing password
    this.password = await bcrypt.hash(this.password, 12);
    // console.log(this.password + 'hashed');
    // no use of confirmpassword
    this.confirmPassword = undefined;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.subscriptionDuration = date;
    next();
});



// checkPassword instance method
userSchema.methods.checkPassword = async function (userPassword, dbPassword) {
    return await bcrypt.compare(userPassword, dbPassword);
};

// create reset token
userSchema.methods.createPasswordResetToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return token;
};

const Users = mongoose.model('Users', userSchema);
module.exports = Users;