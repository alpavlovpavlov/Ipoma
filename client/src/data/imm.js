import { get, post, put, del } from "./api.js";

const endpoints = {
    getCatalog: (state) => `/immData/catalog?sort=label&order=asc&page=${state.currentPage}&limit=${state.limit}`,
    getCatalogForOptions: '/immData/catalog/all?sort=producer&order=asc',
    getByItemId: '/immData/imm/',
    getById: '/immData/imm/',
    create: '/immData/imm',
    search: '/immData/search',
    saveDrawing: '/immData/upload'
}

export function getAll(state) {
    return get(endpoints.getCatalog(state));
}

export function getAllForOptions() {
    return get(endpoints.getCatalogForOptions);
}

export function createIMM(data) {
    return post(endpoints.create, data);
}

export function getById(immId) {
    return get(endpoints.getById + immId);
}

export async function editIMM(id, data) {
    return put(endpoints.getById + id, data);
}

export async function deleteIMM(id) {
    del(endpoints.getById + id);
}

export async function searchImm(query) {
    return post(endpoints.search, query);
}

export async function saveDrawing(data) {
    return await post(endpoints.saveDrawing, data);
}