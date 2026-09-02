const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'This name is already taken'],
        required: [true, 'Name is required'],
        minLength: [3, 'Name must be at least 3 charcters long']
    },

    shape: {
        type: String,
        reuired: [true, 'Shape is required'],
    },

    type: {
        type: String,
        reuired: [true, 'Type is required'],
    },

    cavityNumbers: {
        type: String,
        required: [true, 'Cavity numbers are required'],
    },

    volume: {
        type: Number,
        min: [0, 'Volume must be a positive number']
    },

    weight: {
        type: Number,
        reuired: [true, 'Weight is required'],
        min: [1, 'Weight must be a positive number']
    },

    image: {
        type: String,
        required: [true, 'Product image is required']
    },

    itemDrawing: {
        type: [String],
        validate: {validator: function (value) {
            value.forEach(element => {
                return element.toLowerCase().endsWith(".pdf");
            });
        },
            message: "File must be PDF"
        }
    },

    tds: {
        type: String,
        validate: {validator: function (value) {
            return value.toLowerCase().endsWith(".pdf");
        },
            message: "File must be PDF"
        },
        required: [true, 'TDS is required']
    },

    related: {
        type: [String],
    },

    options: [{
        type: mongoose.Types.ObjectId,
        ref: 'Option'
    }],

    _ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;