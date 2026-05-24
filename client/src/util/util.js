export function setUser(user) {
    sessionStorage.setItem('userData', JSON.stringify(user));
}

export function getUser() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function clearUserData() {
    sessionStorage.removeItem('userData');
}