export function roleAssignment(user, item) {
    const currentUser = {};

    currentUser.isCreator = user?._id == item?._ownerId ? true : false;
    currentUser.role = user != null ? user.role : 'guest';

    return currentUser;
}