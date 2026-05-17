import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getAll } from '../../data/item.js';
import { titleChange } from '../../util/title.js';
import { renderPageNumbers } from '../../util/renderPageNumbers.js';
import { updatePaginationUI } from '../../util/updatePagination.js';
import { notify } from '../notify.js';

const handlesCatalogTemplate = (lids, isLoading) => html`
    <section id="meme-feed">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <h1>All handles</h1>
                <div id="memes">
                    ${lids.length == 0
                        ? html`<p class="no-memes">No lids in database.</p>`
                        : html`${lids.map(lidTemplate)}
                            <div class="middle">
                                <button class="paginbtn" id="prevlid">< Previous</button>
                                <div id="page-numbers"></div>
                                <button class="paginbtn" id="nextlid">Next ></button>
                            </div>
                        `
                    }
                </div>
            `
        }
    </section>
`;

const lidTemplate = (lid) => html`
    <div class="meme">
        <div class="card">
            <div class="info">
                <p class="meme-title">${lid.name}</p>
                <img class="meme-image" alt="meme-img" src="${host}/${lid.image}">
            </div>
            <div id="data-buttons">
                <a class="button" href="/details/${lid._id}">Details</a>
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

export async function handlesCatalogPage(ctx) {
    titleChange('lid Catalog Page');
    context = ctx;
    ctx.render(handlesCatalogTemplate([], true));
    let shape = '';

    if (localStorage.getItem('resetState') == 'yes') {
        state.currentPage = 1;
        localStorage.setItem('resetState', 'no');
    }
    
    try {
        const lids = await getAll(shape, 'Handle', state);
        state.totalPages = lids.totalPages;
        
        ctx.render(handlesCatalogTemplate(lids.data, false));
        renderPageNumbers(state, handlesCatalogPage, ctx);
        updatePaginationUI('prevlid', 'nextlid', state, handlesCatalogPage, context);
    } catch (error) {
        notify(error);
    }
}