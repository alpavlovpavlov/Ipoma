import { html } from '../../node_modules/lit-html/lit-html.js';

import { titleChange } from '../util/title.js';

const homeTemplate = () => html`
    <section class="home-page">
        <img class="home-img" src="/images/products.png" alt="home" />
        <h2 id="home-h2">Searching for a product?</h2>
        <h3>Please visit items catalog page or <a href="/contacts">contact us</a></h3>
    </section>
`;

export function homePage(ctx) {
    titleChange('Home Page');
    
    ctx.render(homeTemplate());
}