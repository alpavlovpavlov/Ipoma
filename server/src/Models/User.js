const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User name is required'],
        unique: [true, 'This user name is already taken'],
        minLength: [4, 'User name should be at least 4 charcters long']
    },
   
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: [true, 'This email address is already taken'],
        minLength: [10, 'Email must be at least 10 charcters long!']
    },

    hashedPassword: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password must be at least 4 characters long']
    },

    role: {
        type: String,
        enum: ['user', 'ipoma-user', 'admin'],
        default: 'user'
    },

    isVerified: {
        type: Boolean, default: false
    },

    emailVerificationTokenHash: String,

    emailVerificationExpires: Date,

    passwordResetTokenHash: String,

    passwordResetExpires: Date,
    
    createdItems: [{
        type: mongoose.Types.ObjectId,
        ref: 'Item'
    }]
})

const User = mongoose.model('User', userSchema);

module.exports = User;