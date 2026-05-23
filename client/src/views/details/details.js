import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { titleChange } from '../../util/title.js';
import { getUser } from '../../util/util.js';
import { getItem } from '../../data/item.js';
import { notifyNoEvent } from '../notify.js';

const detailsTemplate = (item, isLogged) => html`
    <section id="meme-feed">
        <div class="meme">
            <h1>All Details</h1>
            <div id="memes">
                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="${item.image}">
                    </div>
                    <a class="button" href="/item-details/${item._id}">Item details</a>
                </div>
                ${isLogged
                    ? html`
                        <div class="info">
                            <div>
                                <img class="meme-image" alt="meme-img" src="/images/mould.jpg">
                            </div>
                            <a class="button" href="/mold-details/${item._id}">Mold details</a>
                        </div>
                        `
                    : ''
                }
                <div class="middle">
                    <button class="button" @click=${onBackClick}>< Back</button>
                    <!-- <a class="button" href="/${item.type}s-catalog/${item.shape}">< Back</a> -->
                </div>
            </div>
        </div>
    </section>
`;

let context = null;
let item = {};

export async function detailsPage(ctx) {
    titleChange('Details Page');
    context = ctx;

    const itemId = ctx.params.itemId;
    const user = getUser();
    const isLogged = user != undefined ? true : false;

    try {
        item = await getItem(itemId);
        
        const type = item.type.toLowerCase();
        item.type = type;
        
        ctx.render(detailsTemplate(item, isLogged));
    } catch (error) {
        notifyNoEvent(error);
    };
}

function onBackClick() {
    if (item.type != 'handle') {
        context.page.redirect(`/${item.type}s-catalog/${item.shape}`);
    } else {
        context.page.redirect(`/${item.type}s-catalog`);
    }
}