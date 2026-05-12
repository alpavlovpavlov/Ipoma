const Option = require('../Models/Option');

async function createAnOption(data) {
    return Option.create(data);
};

async function delOption(id) {
    await Option.findByIdAndDelete(id);
};

module.exports = {
    createAnOption,
    delOption
}; 