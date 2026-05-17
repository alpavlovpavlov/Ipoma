import { html } from 'https://unpkg.com/lit?module';

import { sendRequestForPasswordReset } from '../../data/auth.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';

const renewTemplate = () => html`
    <section id="login">
        <form id="login-form" @submit=${onRenew}>
            <div class="container">
                <h1>Enter your email</h1>
                <input class="input-create" id="email" placeholder="Enter Email" name="email" type="text">
                <input type="submit" class="registerbtn button" value="Send">
            </div>
        </form>
    </section>
`;

let context = null;

export function forgotPassPage(ctx) {
    titleChange('Forgot Password Page');
    context = ctx;

    ctx.render(renewTemplate());
}

async function onRenew(event) {
    const { data, form } = onSubmit(event);
    
    try {
        if(data) {
            if(data.email == '') {
                throw new Error('Email is required!');
            }

            await sendRequestForPasswordReset(data.email);

            context.page.redirect('/login');
        }

        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}