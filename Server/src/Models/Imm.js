const mongoose = require('mongoose');

const immSchema = new mongoose.Schema({
    producer: {
        type: String,
        required: [true, 'IMM producer is required'],
        minLength: [3, 'Producer must be at lesat 3 charcters long']
    },

    label: {
        type: String,
        required: [true, 'IMM label is required'],
        unique: [true, 'This label is already taken'],
        minLength: [3, 'Label must be at lesat 3 charcters long']
    },

    date: {
        type: String,
        required: [true, 'Date of assed manufacturing is required']
    },

    immNumber: {
        type: Number,
        required: [true, 'IMM serial number is required'],
        unique: [true, 'This serial number is already taken'],
        minLength: [5, 'Serial number must be at lesat 5 charcters long']
    },

    force: {
        type: Number,
        required: [true, 'IMM force is required'],
        minLength: [5, 'Force must be at lesat 5 charcters long']
    },

    injectionUnit: {
        type: String,
        required: [true, 'Injection unit is required']
    },

    immDrawing: {
        type: [String],
        validate: {validator: function (value) {
            value.forEach(element => {
                return element.toLowerCase().endsWith(".pdf");
            });
        },
            message: "File must be PDF"
        }
    },

    type: {
        type: String,
        required: [true, 'IMM type is required'],
        minLength: [3, 'Type must be at lesat 3 charcters long']
    },

    _ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner id is required']
    },

    options: [{
        type: mongoose.Types.ObjectId,
        ref: 'Option'
    }]
})

const Imm = mongoose.model('Imm', immSchema);

module.exports = Imm;