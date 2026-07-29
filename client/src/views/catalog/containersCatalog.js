import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getAll } from '../../data/item.js';
import { getUser } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { renderPageNumbers } from '../../util/renderPageNumbers.js';
import { updatePaginationUI } from '../../util/updatePagination.js';
import { notifyNoEvent } from '../notify.js';

const catalogTemplate = (items, isLoading, shape, extention) => html`
    <section id="meme-feed">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                ${shape != ''
                    ? html`<h1 class="h1">${shape} Containers</h1>`
                    : html`<h1 class="h1">All Containers</h1>`
                }
                <div id="memes">
                    ${items.length == 0
                        ? html`
                            <p class="no-memes">No containers in database.</p>
                            <div class="middle">
                                <a href="/containers-shape" class="button">< Back</a>
                            </div>
                        `
                        : html`
                            ${items.map((item) => containerTemplate(item, extention))}

                            <div class="middle">
                                <button class="paginbtn" id="prevItem">< Previous</button>
                                <div id="page-numbers"></div>
                                <button class="paginbtn" id="nextItem">Next ></button>
                            </div>
                            <div class="middle">
                                <a href="/containers-shape" class="button">< Back</a>
                            </div>
                        `
                    }
                </div>
            `
        }
    </section>
`;

const containerTemplate = (item, extention) => html`
    <div class="meme">
        <div class="card">
            <div class="info">
                <p class="meme-title">${item.name}</p>
                <img class="meme-image" alt="meme-img" src="${item.image}">
            </div>
            <div id="data-buttons">
                ${extention == 'ipoma'
                    ? html`<a class="button" href="/details/${item._id}">Details</a>`
                    : html`<a class="button" href="/item-details/${item._id}">Details</a>`
                }
            </div>
        </div>
    </div>
`;

let context = '';

const state = {
    currentPage: 1,
    limit: 4,
    totalPages: 1
}

export async function containersCatalogPage(ctx) {
    titleChange('Item Catalog Page');
    context = ctx;
    const user = getUser();
    let extention = null;

    if (user != null) {
        extention = user.email.split('@')[1].split('.')[0];
    }

    let shape = ctx.params.shape;
    ctx.render(catalogTemplate([], true, shape, extention));

    if (localStorage.getItem('resetState') == 'yes') {
        state.currentPage = 1;
        localStorage.setItem('resetState', 'no');
    }

    if (shape == 'all' || shape == null) {
        shape = '';
    }

    try {
        const items = await getAll(shape, 'Container', state);
        state.totalPages = items.totalPages;
        
        ctx.render(catalogTemplate(items.data, false, shape, extention));
        
        renderPageNumbers(state, containersCatalogPage, ctx);
        updatePaginationUI('prevItem', 'nextItem', state, containersCatalogPage, context);
    } catch (error) {
        notifyNoEvent(error);
    }
}