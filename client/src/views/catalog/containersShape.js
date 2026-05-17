import { html } from 'https://unpkg.com/lit?module';

import { titleChange } from '../../util/title.js';

const containersShapeTemplate = () => html`
    <section id="meme-feed">
        <div class="meme">
            <h1>Containers by shape</h1>
            <h2 class="underline"></h2>
            <div id="memes">
                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/Round.webp">
                    </div>
                    <button data-shape="Round" @click=${request} class="button">Round</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/Rectangular.webp">
                    </div>
                    <button data-shape="Rectangular" @click=${request} class="button">Rectangular</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/Square.jpg">
                    </div>
                    <button data-shape="Square" @click=${request} class="button">Square</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/Oval.webp">
                    </div>
                    <button data-shape="Oval" @click=${request} class="button">Oval</button>
                </div>

                <div class="info">
                    <div>
                        <img class="meme-image" alt="meme-img" src="/images/products.jpg">
                    </div>
                    <button data-shape="all" @click=${request} class="button">All Containers</button>
                </div>
            </div>
        </div>
    </section> 
`;

let context = null;

export async function containersShapePage(ctx) {
    context = ctx;
    titleChange('Containers Shape Page');

    ctx.render(containersShapeTemplate());
}

function request(e) {
    let shape = e.target.dataset.shape;
   
    localStorage.setItem('resetState', 'yes');
    
    context.page.redirect(`/containers-catalog/${shape}`);
}