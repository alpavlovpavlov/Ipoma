import { html } from 'https://unpkg.com/lit?module';

import { onSubmit } from '../../middlewears/submit.js';
import { searchImm } from '../../data/imm.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';

const searchTemplate = (results, isLoading) => html`
    <section class="search">
        <h1>Search IMM</h1>

        <form class="form-group" action="/search" method="post" @submit=${onSearch}>
            <input id="producer" type="text" class="input-create" name="producer" placeholder="Search by brand">
            <input id="imm" type="text" class="input-create" name="label" placeholder="Search by label">
            <input id="force" type="text" class="input-create" name="force" placeholder="Search by clamping force, t">
            
            <select class="option-create" type="text" name="injectionUnit">
                <option value="" disabled selected>Search by machine injection unit</option>
                <option>Single</option>
                <option>2K</option>
            </select>

            <select class="option-create" id="type" type="text" name="type">
                <option value="" disabled selected>Search by machine type</option>
                <option>Hydraulic</option>
                <option>Hybrid</option>
                <option>Fully electric</option>
            </select>
            <button type="submit" class="searchbtn">Search</button>
        </form>

        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                ${Array.isArray(results) == true
                    ? html`
                        <div class="search-result">
                            ${results.length > 0
                                ? html`${results.map(immTemplate)}`
                                : html`
                                    <div class="no-match">
                                        <p>No match was found!</p>
                                    </div>
                                `
                            }
                        </div>
                    `
                    : ''
                }
            `
        }
    </section>
`;

const immTemplate = (result) => html`
    <div class="result">
        <div class="card">
            <div class="info">
                <p class="meme-title">${result.producer}</p>
                <p class="meme-title">${result.label}</p>
            </div>
            <div id="data-buttons">
                <a class="button" href="/imm-details/${result._id}">Details</a>
            </div>
        </div>
    </div>
`;

let context = null;

export function searchImmPage(ctx) {
    context = ctx;
    titleChange('Search IMM Page');
    ctx.render(searchTemplate());
}

async function onSearch(event) {
    const { data, form } = onSubmit(event);

    try {
        context.render(searchTemplate([], true));

        const results = await searchImm(data);
        
        context.render(searchTemplate(results, false));

        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}