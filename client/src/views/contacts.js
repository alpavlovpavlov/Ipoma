import { html } from '../../node_modules/lit-html/lit-html.js';

import { titleChange } from '../util/title.js';

const contactTemplate = () => html`
    <section id="user-profile-page" class="user-profile">
        <article class="user-info" id="article">
            <img id="user-avatar-url" alt="user-profile" src="/images/sales.jpg">
            <div class="user-content">
                <h2 id="company-name">Thrce - IPOMA SA</h2>
                <p><strong>phone:</strong> +359 2 345 653</p>
                <p><strong>mobile:</strong> +359 899 298 790</p>
                <p><strong>email:</strong> <a href="mailto:sales@ipoma.com">sales@ipoma.com</a></p>
                <p><strong>address:</strong> 7, "5007" st. Gara Iskar, 1528, Sofia, Bulgaria. 
                    <a href="https://www.google.com/maps/search/?api=1&query=7+5007+str+Gara+Iskar+1528+Sofia+Bulgaria" target="_blank">View on map</a>
                </p>
            </div>
        </article>
        <h2 id="user-listings-title"></h2>
    </section>
`;

export function contactPage(ctx) {
    titleChange('Contacts');
    
    ctx.render(contactTemplate());
}