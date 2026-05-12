import { html } from '../../node_modules/lit-html/lit-html.js';

const notFoundTemplate = () => html`
    <section id="errorPage">
        <img class="error-page" src="/../images/404.png">
        <div>
            <h2>Awww... Dont't Cry.</h2>
            <h3>It's just a 404 Error!</h3>
            <h3>What you're looking for may have been misplaced in Long Term Memory.</h3>
        </div>
    </section>
`;

export function notFoundPage(ctx) {
    ctx.render(notFoundTemplate());
}
