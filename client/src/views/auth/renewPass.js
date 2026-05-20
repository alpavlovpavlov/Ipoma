import { html } from 'https://unpkg.com/lit?module';

import { resetPassword } from '../../data/auth.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { notify } from '../notify.js';

const renewPassTemplate = () => html`
    <section id="register">
        <form id="register-form" @submit=${onRenew}>
            <div class="container">
                <h1>Please enter your new password</h1>
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Enter Password" name="password">
                <label for="repeatPass">Repeat Password</label>
                <input id="repeatPass" type="password" placeholder="Repeat Password" name="rePass">
                <input type="submit" class="registerbtn button" value="Send">
            </div>
        </form>
    </section>
`;

let token = null;

export function renewPassPage(ctx) {
    titleChange('Renew Password Page');
    context = ctx;
    token = ctx.params.token;

    ctx.render(renewPassTemplate());
}

async function onRenew(event) {
    const { data, form } = onSubmit(event);
    
    try {
        if(data) {
            if (data.password == '') {
                throw 'Password is required';
            }

            if(data.password != data.rePass) {
                throw 'Passwords don\'t match';
            }

            const payload = {
                token,
                newPassword: data.password
            }
            
            await resetPassword(payload);
            
            return alert('Password changed successfully. You can close the tab now');
        }

        form.reset();
    } catch (error) {
        notify(error, event);
    }
}