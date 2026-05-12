const mongoose = require('mongoose');

const User = require('../Models/User');
const Profile = require('../Models/Profile');
const parseError = require('../utils/parser');

async function createUserWithProfile() {
    const session = mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.create(
            [{ name: 'Ivan' }],
            { session }
        );

        await Profile.create(
            [{
                userId: user[0]._id,
                bio: 'Hello world'
            }],
            { session }
        );
        session.commitTransaction();
    } catch (error) {
        session.abortTransaction();
        const message = parseError(error);
        res.status(400).json({ message });
    } finally {
        session.endSession();
    }
};