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
    passwordChangedAt: {
        type: String
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
    watchList: {
        type: [String]
    }
});

// encrypt user password before save
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// checkPassword middleware
userSchema.methods.checkPassword = async (userPassword, dbPassword) => {
    return await bcrypt.compare(userPassword, dbPassword);
};

// create reset token
userSchema.methods.createResetToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    return token;
};

const Users = mongoose.model('Users', userSchema);
module.exports = Users;