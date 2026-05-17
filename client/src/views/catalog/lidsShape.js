import { html } from 'https://unpkg.com/lit?module';

import { titleChange } from '../../util/title.js';

const lidsShapeTemplate = () => html`
    <section id="meme-feed">
        <div class="meme">
            <h1>Lids by shape</h1>
            <h2 class="underline"></h2>
            <div id="memes">
                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/RoundLids.webp">
                    </div>
                    <button data-shape="Round" @click=${request} class="button">Round</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/ReLid.jpg">
                    </div>
                    <button data-shape="Rectangular" @click=${request} class="button">Rectangular</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/SqLid.webp">
                    </div>
                    <button data-shape="Square" @click=${request} class="button">Square</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/OvLid.webp">
                    </div>
                    <button data-shape="Oval" @click=${request} class="button">Oval</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/products.jpg">
                    </div>
                    <button data-shape="all" @click=${request} class="button">All Lids</button>
                </div>
            </div>
        </div>
    </section> 
`;

let context = null;

export async function lidsShapePage(ctx) {
    context = ctx;
    titleChange('Lids Shape Page');

    ctx.render(lidsShapeTemplate());
}

function request(e) {
    let shape = e.target.dataset.shape; 
    
    localStorage.setItem('resetState', 'yes');
    
    context.page.redirect(`/lids-catalog/${shape}`);
}