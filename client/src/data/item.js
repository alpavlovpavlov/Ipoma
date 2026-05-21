import { get, post, put, del } from "./api.js";

const endpoints = {
    getCatalog: (shape, type, state) => `/itemData/catalog?shape=${shape}&type=${type}&sort=volume&order=asc&page=${state.currentPage}&limit=${state.limit}`,
    getById: '/itemData/item/',
    search: '/itemData/search',
    getFiles: '/files',
    sendDrawing: '/itemData/upload'
};

export function getFiles(folderName) {
    return get(endpoints.getFiles + folderName);
};

export function getAll(shape, type, state) {
    return get(endpoints.getCatalog(shape, type, state));
};

export function getItem(id) {
    return get(endpoints.getById + id);
};

export async function editItem(id, data) {
    put(endpoints.getById + id, data);
};

export async function deleteItem(id) {
    del(endpoints.getById + id);
};

export async function searchItem(query) {
    return post(endpoints.search, query);
};

export async function sendDrawing(data) {
    return post(endpoints.sendDrawing, data);
};