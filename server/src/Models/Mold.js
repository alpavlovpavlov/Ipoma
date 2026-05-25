const mongoose = require('mongoose');

const moldSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'This name is already taken'],
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 charcters long']
    },

    date: {
        type: String,
        required: [true, 'Date of assed manufacturing is required']
    },

    numberOfCavities: {
        type: Number,
        required: [true, 'Cavity number is required'],
        min: [1, 'Cavity number must be a positive number']
    },

    moldDrawing: {
        type: [String],
        validate: {validator: function (value) {
            value.forEach(element => {
                return element.toLowerCase().endsWith(".pdf");
            });
        },
            message: "File must be PDF"
        }
    },

    producer: {
        type: String,
        reuired: [true, 'Mold producer is required'],
        minLength: [2, 'Mold producer must be at least 2 charcters long']
    },

    serialNumber: {
        type: String,
        required: [true, 'Mold serial number is required'],
        minLength: [3, 'Serial number must be at least 3 charcters long']
    },

    hotRunnerMan: {
        type: String,
        required: [true, 'Hot-runner producer is required'],
        minLength: [1, ' Hot-runner producer must be at least 3 charcters long']
    },

    hotRunnerSer: {
        type: String
    },

    pitchDistance: {
        type: String,
    },

    wayOfInjection: {
        type: String,
    },

    _ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    _itemId: {
        type: mongoose.Types.ObjectId,
        ref: 'Item',
    }
})

const Mold = mongoose.model('Mold', moldSchema);

module.exports = Mold;