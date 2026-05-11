import { html } from '../../../node_modules/lit-html/lit-html.js';

import { getAll } from '../../data/imm.js';
import { titleChange } from '../../util/title.js';
import { renderPageNumbers } from '../../util/renderPageNumbers.js';
import { updatePaginationUI } from '../../util/updatePagination.js';
import { notifyNoEvent } from '../notify.js';

const immCatalogTemplate = (imms, isLoading) => html`
    <section id="meme-feed">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <h1 class="h1">All IMMs</h1>
                <div id="memes1">
                    ${imms.length == 0
                        ? html`<p class="no-memes">No IMMs in database.</p>`
                        : html`${imms.map(immTemplate)}
                            <div class="middle">
                                <button class="paginbtn" id="prevImm">< Previous</button>
                                <div id="page-numbers"></div>
                                <button class="paginbtn" id="nextImm">Next ></button>
                            </div>
                        `
                    }
                </div>
            `
        }
    </section>
`;

const immTemplate = (imm) => html`
    <div class="meme1">
        <div class="card">
            <div class="info">
                <p class="meme-title">${imm.producer}</p>
                <p class="meme-title">${imm.label}</p>
            </div>
            <div id="data-buttons">
                <a class="button" href="/imm-details/${imm._id}">Details</a>
            </div>
        </div>
    </div>
`;

let context = '';

const state = {
    currentPage: 1,
    limit: 16,
    totalPages: 1
}

export async function immCatalogPage(ctx) {
    titleChange('IMM Catalog Page');
    context = ctx;
    
    try {
        ctx.render(immCatalogTemplate([], true));

        const imms = await getAll(state);
        state.totalPages = imms.totalPages;
    
        ctx.render(immCatalogTemplate(imms.data, false));
        
        renderPageNumbers(state, immCatalogPage, ctx);
        updatePaginationUI('prevImm', 'nextImm', state, immCatalogPage, context);
    } catch (error) {
        notifyNoEvent(error);
    }
}