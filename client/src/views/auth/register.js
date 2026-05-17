import { html } from 'https://unpkg.com/lit?module';

import { register } from '../../data/auth.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';

const registerTemplate = () => html`
    <section id="register">
        <form id="register-form" @submit=${onRegister}>
            <div class="container">
                <h1>Register</h1>
                <label for="username">Username</label>
                <input class="input-create" id="username" type="text" placeholder="Enter Username" name="username">
                <label for="email">Email</label>
                <input class="input-create" id="email" type="text" placeholder="Enter Email" name="email">
                <label for="password">Password</label>
                <input class="input-create" id="password" type="password" placeholder="Enter Password" name="password">
                <label for="repeatPass">Repeat Password</label>
                <input class="input-create" id="repeatPass" type="password" placeholder="Repeat Password" name="rePass">
                <div class="buttons-row">
                    <button type="submit" class="button">Register</button>
                </div>
                <div class="container signin">
                    <p>Already have an account?<a href="/login"> Sign in</a></p>
                </div>
            </div>
        </form>
    </section>
`;

let context = null;

export function registerPage(ctx) {
    titleChange('Register Page');
    context = ctx;

    ctx.render(registerTemplate());
}

async function onRegister(event) {
    const { data, form } = onSubmit(event);
    
    try {
        if(data) {
            if(data.username == '' || data.email == '' || data.password == '') {
                throw 'All fields are required!';
            }
            
            if(data.password != data.rePass) {
                throw 'Passwords don\'t match';
            }

            await register(data);
            context.page.redirect('/login');
        };

        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    };
}