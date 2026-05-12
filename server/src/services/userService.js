const User = require("../Models/User");

const { createToken } = require('../services/authService');

async function findUserByToken({ emailVerificationTokenHash, emailVerificationExpires }) {
    return await User.findOne({
        emailVerificationTokenHash,
        emailVerificationExpires
    })
}

async function findUserByResetToken({ passwordResetTokenHash, passwordResetExpires }) {
    return await User.findOne({
        passwordResetTokenHash,
        passwordResetExpires
    })
}

async function findUserByEmail(email) {
    return await User.findOne({ email });
}

async function editUser(userId, data) {
    const modifiedUser = await User.findByIdAndUpdate(userId, data, { runValidators: true,  new: true });
    
    const user = {
        _id: modifiedUser._id,
        email: modifiedUser.email,
        username: modifiedUser.username,
        role: modifiedUser.role
    };

    return createToken(user);
}

async function deleteUser(id) {
    return await User.findByIdAndDelete(id);
}

module.exports = {
    findUserByToken,
    findUserByResetToken,
    findUserByEmail,
    editUser,
    deleteUser
}