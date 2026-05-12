const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    categories: {
        type: [String],
    },

    immName: {
        type: String,
        required: [true, 'IMM name is required']
    },

    imm: {
        type: mongoose.Types.ObjectId,
        ref: 'Imm',
        
    },
    
    item: {
        type: mongoose.Types.ObjectId,
        ref: 'Item',
        
    }
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;