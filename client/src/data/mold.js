import { get, post, put, del } from "./api.js";

const endpoints = {
    getCatalog: '/moldData/mold',
    getByItemId: '/moldData/mold/',
    getById: '/moldData/molds/',
    create: '/moldData/mold',
    getFiles: '/files',
    sendDrawing: '/moldData/upload'
};

export function getFiles(folderName) {
    return get(endpoints.getFiles + folderName);
};

export function getAll() {
    return get(endpoints.getCatalog);
};

export function getMoldByItemId(itemId) {
    return get(endpoints.getByItemId + itemId);
};

export function getById(moldId) {
    return get(endpoints.getById + moldId);
};

export function getMold(id) {
    return get(endpoints.getById + id);
};

export async function createMoldAndItem(dataArr) {
    return post(endpoints.create, dataArr);
};

export async function editMold(id, data) {
    return put(endpoints.getById + id, data);
};

export async function deleteMoldAndItem(id) {
    del(endpoints.getById + id);
};

export async function sendDrawing(data) {
    return post(endpoints.sendDrawing, data);
};