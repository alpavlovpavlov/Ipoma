import { clearUserData, setUser } from "../util/util.js";
import { get, post, put, del } from "./api.js";

const endpoints = {
    register: '/users/register',
    confirmEmail: `/api/verify-email/`,
    login: '/users/login',
    logout: '/users/logout',
    chgPass: '/users/chg-password',
    forgot: '/api/forgot-password/',
    renew: '/api/reset-password',
    edit: '/users/edit-profile',
    del: '/users/delete/'
}

export async function register(userData) {
    await post(endpoints.register, userData);
}

export async function sendMailConfirmation(token) {
    await get(endpoints.confirmEmail + token);
}

export async function sendRequestForPasswordReset(email) {
    await post(endpoints.forgot + email);
}

export async function changePassword(data) {
    await put(endpoints.chgPass, data);
}

export async function resetPassword(data) {
    post(endpoints.renew, data);
}

export async function login(userData) {
    const user = await post(endpoints.login, userData);
    setUser(user);
}

export async function editProfile(data) {
    const user = await put(endpoints.edit, data);
    setUser(user);
}

export async function logout() {
    await get(endpoints.logout);
    clearUserData();
}

export async function deleteUser(id) {
    await del(endpoints.del + id);
}