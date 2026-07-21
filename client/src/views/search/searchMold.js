import { html } from 'https://unpkg.com/lit?module';

import { onSubmit } from '../../middlewears/submit.js';
import { searchMold } from '../../data/mold.js';
import { titleChange } from '../../util/title.js';
import { getUser } from '../../util/util.js';
import { notifyNoEvent } from '../notify.js';
import { inputSanitizer } from "../../util/changeElementState.js";

const searchTemplate = (results, isLoading) => html`
    <section class="search">
        <h1>Search Mold</h1>

        <form class="form-group" action="/search" method="post" @submit=${onSearch}>
            <input id="item" type="text" class="input-create name" name="name" placeholder="Search by Item name...">
            
            <select type="text" name="type">
                <option value="" disabled selected>Search by product type</option>
                <option>Container</option>
                <option>Lid</option>
                <option>Handle</option>
            </select>
        
            <select type="text" name="shape">
                <option value="" disabled selected>Search by product shape</option>
                <option>Round</option>
                <option>Square</option>
                <option>Rectangular</option>
                <option>Oval</option>
            </select>

            <select type="text" name="hotRunnerMan">
                <option value="" disabled selected>Search by Hot-Runner</option>
                <option>DME</option>
                <option>Maenner</option>
                <option>Mold Masters</option>
                <option>Husky</option>
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
                                ? html`${results.map((result) => moldTemplate(result))}`
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

const moldTemplate = (result) => html`
    <div class="result">
        <div class="card">
            <div class="info">
                <p class="meme-title">${result.name}</p>
            </div>
            <div id="data-buttons">
                <a class="button" href="/details/${result._itemId}">Details</a>
            </div>
        </div>
    </div>
`;

let context = null;

export function searchMoldPage(ctx) {
    context = ctx;
    titleChange('Search Item Page');

    ctx.render(searchTemplate());

    inputSanitizer();
}

async function onSearch(event) {
    const { data, form } = onSubmit(event);
    const user = getUser();
    let extention = null;
    
    try {
        context.render(searchTemplate('', true));
        
        const results = await searchMold(data);
        
        context.render(searchTemplate(results, false));

        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}