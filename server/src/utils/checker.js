function checkIfUserIsCreator(userId, item) {
    return userId === item.owner?._id.toString() ? true : false;
}

function checkIfUserBought(userId, item) {
    // let isBought = false;
    // if (item.buyingList.some(user => user._id.toString() === userId)) {
    //     isBought = true;
    // }

    return item.buyingList.some(user => user?._id.toString() === userId) ? true : false;
    // return isBought;
}

module.exports = {
    checkIfUserIsCreator,
    checkIfUserBought
}