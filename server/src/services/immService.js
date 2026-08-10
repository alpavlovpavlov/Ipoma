const Imm = require('../Models/Imm');

function getAll(sortedField, order) {
    return Imm.find().sort({ [sortedField]: order });
}

function getAllSorted(sortedField, order, skip, limit) {
    return Imm.find().sort({ [sortedField]: order }).skip(skip).limit(limit);
}

function getOne(id) {
    return Imm.findById(id);
}

function countDocuments() {
    return Imm.countDocuments();
}

function createImm(data) {
    return Imm.create(data);
}

function addItemToImm(immId, itemId) {
    return Imm.findByIdAndUpdate(immId, { $push: { items: itemId} });
}

function getImmById(id) {
    return Imm.findById(id).populate('options');
}

function editImm(id, data) {
    return Imm.findByIdAndUpdate(id, data, { runValidators: true, new: true });
}

function searchImm(producer = '', label = '', force = '', injectionUnit = '', type = '') {
    const query = {};

    if (producer) {
        query.producer = new RegExp(producer, 'i');
    }

    if (label) {
        query.label = new RegExp(label, 'i');
    }

    if (force) {
        query.force = Number(force);
    }

    if (injectionUnit) {
        query.injectionUnit = new RegExp(injectionUnit, 'i');
    }

    if (type) {
        query.type = new RegExp(type, 'i');
    }
    
    return Imm.find(query);
}

async function addOptionToAnImm(immId, optionId) {
    return Imm.findByIdAndUpdate(immId, { $push: { options: optionId } });
}

async function deleteAnOption(immId, optionId) {
    const imm = await Imm.findById(immId);
    
    if (Array.isArray(imm.options)) {
        const index = imm.options.indexOf(optionId);

        if (index != -1) imm.options.splice(index, 1);

        imm.save();
    } else {
        return;
    }
}

async function delImm(id) {
    return Imm.findByIdAndDelete(id);
}

module.exports = {
    getAll,
    getAllSorted,
    getOne,
    countDocuments,
    createImm,
    addItemToImm,
    getImmById,
    editImm,
    searchImm,
    addOptionToAnImm,
    deleteAnOption,
    delImm
}