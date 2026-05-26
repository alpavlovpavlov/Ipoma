import { html } from 'https://unpkg.com/lit?module';

import { onSubmit } from '../../middlewears/submit.js';
import { searchItem } from '../../data/item.js';
import { titleChange } from '../../util/title.js';
import { getUser } from '../../util/util.js';
import { notifyNoEvent } from '../notify.js';

const searchTemplate = (results, isLoading, extention) => html`
    <section class="search">
        <h1>Search Item</h1>

        <form class="form-group" action="/search" method="post" @submit=${onSearch}>
            <input id="item" type="text" class="input-create" name="name" placeholder="Search by Name...">
            <select type="text" placeholder="Item shape" name="shape">
                <option value="" disabled selected>--Choose product shape--</option>
                <option>Round</option>
                <option>Square</option>
                <option>Rectangular</option>
                <option>Oval</option>
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
                                ? html`${results.map((result) => itemTemplate(result, extention))}`
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

const itemTemplate = (result, extention) => html`
    <div class="result">
        <div class="card">
            <div class="info">
                <p class="meme-title">${result.name}</p>
                <img class="meme-image" alt="meme-img" src="${result.image}">
            </div>
            <div id="data-buttons">
                ${extention == 'ipoma'
                    ? html`<a class="button" href="/details/${result._id}">Details</a>`
                    : html`<a class="button" href="/item-details/${result._id}">Details</a>`
                }
                
            </div>
        </div>
    </div>
`;

let context = null;

export function searchItemPage(ctx) {
    context = ctx;
    titleChange('Search Item Page');

    ctx.render(searchTemplate());
}

async function onSearch(event) {
    const { data, form } = onSubmit(event);
    const user = getUser();
    let extention = null;

    if (user != null) {
        extention = user.email.split('@')[1].split('.')[0];
    }
    
    try {
        context.render(searchTemplate('', true, extention));
        
        const results = await searchItem(data);
        
        context.render(searchTemplate(results, false, extention));

        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}