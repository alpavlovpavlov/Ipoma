const mongoose = require('mongoose');

const Mold = require('../Models/Mold');
const Item = require('../Models/Item');

function getAll() {
    return Mold.find({});
}

function getOne(id) {
    return Mold.findById(id);
}

function getOneByItemId(itemId) {
    return Mold.find({ _itemId: itemId }).populate('_itemId');
}

async function createItemWithMold({ item, mold }) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        
        const [createdItem] = await Item.create([item], { session });
        const [createdMold] = await Mold.create([mold], { session });
        
        await session.commitTransaction();
        
        await Item.find({});
        await Mold.find({});
        
        return { createdItem, createdMold };
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
}

async function assignItemId(moldId, data) {
    return await Mold.findByIdAndUpdate(moldId, data, { runValidators: true });
}

function edit(id, data) {
    // Options must be added as a third parameter to all update mongoose functions, 
    // because the default behavior let unvalid data to pass to the DB!
    return Mold.findByIdAndUpdate(id, data, { runValidators: true });
}

function search(name = '', type = '', shape = '', hotRunnerMan = '') {
    const query = {};

    if (name) {
        query.name = new RegExp(name, 'i');
    }

    if (hotRunnerMan) {
        query.hotRunnerMan = new RegExp(hotRunnerMan, 'i');
    }
    
    return Mold.find(query);
}

async function del(itemId, moldId) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const res1 = await Item.deleteOne({ _id: itemId }, { session });
        if (res1.deletedCount !== 1) {
            throw new Error('Item not found');
        }

        const res2 = await Mold.deleteOne({ _id: moldId }, { session });
        if (res2.deletedCount !== 1) {
            throw new Error('Mold not found');
        }
        
        await session.commitTransaction();

        return { itemId, moldId };
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }

        throw error;
    } finally {
        session.endSession();
    }
}

module.exports = {
    getAll,
    getOne,
    getOneByItemId,
    createItemWithMold,
    assignItemId,
    edit,
    search,
    del
}