import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getAll } from '../../data/item.js';
import { titleChange } from '../../util/title.js';
import { renderPageNumbers } from '../../util/renderPageNumbers.js';
import { updatePaginationUI } from '../../util/updatePagination.js';
import { getUser } from '../../util/util.js';
import { notifyNoEvent } from '../notify.js';

const lidsCatalogTemplate = (lids, isLoading, shape, extention) => html`
    <section id="meme-feed">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                ${shape != ''
                    ? html`<h1>${shape} lids</h1>`
                    : html`<h1>All lids</h1>`
                }
                <div id="memes">
                    ${lids.length == 0
                        ? html`
                            <p class="no-memes">No lids in database.</p>
                            <div class="middle">
                                <a href="/lids-shape" class="button">< Back</a>
                            </div>
                        `
                        : html`
                            ${lids.map((lid) => lidTemplate(lid, extention))}
                            <div class="middle">
                                <button class="paginbtn" id="prevlid">< Previous</button>
                                <div id="page-numbers"></div>
                                <button class="paginbtn" id="nextlid">Next ></button>
                            </div>
                            <div class="middle">
                                <a href="/lids-shape" class="button">< Back</a>
                            </div>
                        `
                    }
                </div>
            `
        }
    </section>
`;

const lidTemplate = (lid, extention) => html`
    <div class="meme">
        <div class="card">
            <div class="info">
                <p class="meme-title">${lid.name}</p>
                <img class="meme-image" alt="meme-img" src="${host}/${lid.image}">
            </div>
            <div id="data-buttons">
                ${extention == 'ipoma'
                    ? html`<a class="button" href="/details/${lid._id}">Details</a>`
                    : html`<a class="button" href="/item-details/${lid._id}">Details</a>`
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

export async function lidsCatalogPage(ctx) {
    titleChange('lid Catalog Page');
    context = ctx;
    const user = getUser();
    let extention = null;

    if (user != null) {
        extention = user.email.split('@')[1].split('.')[0];
    }

    ctx.render(lidsCatalogTemplate([], true));
    let shape = ctx.params.shape;

    if (localStorage.getItem('resetState') == 'yes') {
        state.currentPage = 1;
        localStorage.setItem('resetState', 'no');
    }

    if (shape == 'all' || shape == null) {
        shape = '';
    }

    try {
        const lids = await getAll(shape, 'Lid', state);
        state.totalPages = lids.totalPages;
        
        ctx.render(lidsCatalogTemplate(lids.data, false, shape, extention));

        renderPageNumbers(state, lidsCatalogPage, ctx);
        updatePaginationUI('prevlid', 'nextlid', state, lidsCatalogPage, context);
    } catch (error) {
        notifyNoEvent(error);
    }
}