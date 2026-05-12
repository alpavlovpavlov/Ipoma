import { post, del } from "./api.js";

const endpoints = {
    option: '/options/'
};

export async function createAnOption(id, data) {
    post(endpoints.option + id, data);
};

export async function deleteOption(id, data) {
    await del(endpoints.option + id, data);
};