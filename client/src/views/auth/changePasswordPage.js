import { html } from 'https://unpkg.com/lit?module';

import { changePassword } from '../../data/auth.js';
import { onSubmit } from '../../middlewears/submit.js';
import { getUser, clearUserData } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { notify, notifyNoEvent } from '../notify.js';

const changePassTemplate = () => html`
    <section id="login">
        <form id="login-form" @submit=${onChange}>
            <h2 class="chng-h2">Please fill the fields below</h2>
            <div class="container">
                <input class="input-create" type="password" placeholder="Enter your old password" name="oldPassword" type="text">
                <input class="input-create" type="password" placeholder="Enter new password" name="newPassword" type="text">
                <input class="input-create" type="password" placeholder="Confirm new pasword" name="confPassword" type="text">
                <div class="buttons-row">
                    <a class="button" href="/profile">Cancel</a>
                    <button type="submit" class="button warning">Change Password</button>
                </div>
            </div>
        </form>
    </section>
`;

let context = null;

export function changePassPage(ctx) {
    titleChange('Change Password Page');
    context = ctx;

    ctx.render(changePassTemplate());
}

async function onChange(event) {
    const { data, form } = onSubmit(event);
    const user = getUser();
    
    try {
        if(data) {
            if(data.oldPassword == '' || data.newPassword == '') {
                throw 'All fields are required!';
            }

            if(data.newPassword !== data.confPassword) {
                throw 'Passwords don\'t match';
            }

            const payload = {
                email: user.email,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            }

            await changePassword(payload);
            clearUserData();
            context.updateNav();
            context.page.redirect('/login');
        }

        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}