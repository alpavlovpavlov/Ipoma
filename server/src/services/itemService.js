const Item = require('../Models/Item');

function getAll() {
    return Item.find({});
}

function getAllSorted(filter, sort, skip, limit) {
    return Item.find(filter).sort({ ...sort, _id: 1 }).skip(skip).limit(limit);
}

function countDocuments(filter) {
    return Item.countDocuments(filter);
}

function getOne(id) {
    return Item.findById(id).populate('options');
}

function edit(id, data) {
    // Options must be added as a third parameter to all update mongoose functions,
    // because the default behavior let unvalid data pass to the DB!
    return Item.findByIdAndUpdate(id, data, { runValidators: true, new: true });
}

function findOwner(id) {
    return Item.find({ owner: id });
}

function search(name = '', type = '', shape = '') {
    const query = {};

    if (name) {
        query.name = new RegExp(name, 'i');
    }

    if (type) {
        query.type = new RegExp(type, 'i');
    }

    if (shape) {
        query.shape = new RegExp(shape, 'i');
    }
    
    return Item.find(query);
}

function matchItems(item) {
    return Item.find({
        type: item.type,
        related: { $in: item.related }
    })
}

async function addOptionToAnItem(itemId, optionId) {
    return Item.findByIdAndUpdate(itemId, { $push: { options: optionId } });  
}

async function deleteAnOption(itemId, optionId) {
    const item = await Item.findById(itemId);

    if (Array.isArray(item.options)) {
        const index = item.options.indexOf(optionId);
        
        if (index != -1) item.options.splice(index, 1)
        item.save();
    } else {
        return;
    }
}

module.exports = {
    getAll,
    getAllSorted,
    countDocuments,
    getOne,
    edit,
    findOwner,
    search,
    matchItems,
    addOptionToAnItem,
    deleteAnOption
}