export function setUser(user) {
    localStorage.setItem('userData', JSON.stringify(user));
}

export function getUser() {
    return JSON.parse(localStorage.getItem('userData'));
}

export function clearUserData() {
    localStorage.removeItem('userData');
}