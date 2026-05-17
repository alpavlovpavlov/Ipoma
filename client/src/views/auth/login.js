import { html } from 'https://unpkg.com/lit?module';

import { login, logout } from '../../data/auth.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';

const loginTemplate = () => html`
    <section id="login">
        <form id="login-form" @submit=${onLogin}>
            <div class="container">
                <h1>Login</h1>
                <label for="email">Email</label>
                <input class="input-create" id="email" placeholder="Enter Email" name="email" type="text">
                <label for="password">Password</label>
                <input class="input-create" id="password" type="password" placeholder="Enter Password" name="password">
                <div class="buttons-row">
                    <button type="submit" class="button">Login</button>
                </div>
                <div class="container signin">
                    <p>Don't have an account?<a href="/register"> Sign up</a></p>
                </div>
                <div class="container signin">
                    <a href="/forgot">Forgot your password?</a>
                </div>
            </div>
        </form>
    </section>
`;

let context = null;

export function loginPage(ctx) {
    titleChange('Login Page');
    context = ctx;

    ctx.render(loginTemplate());
}

async function onLogin(event) {
    const { data, form } = onSubmit(event);

    try {
        if(data) {
            if(data.email == '' || data.password == '') {
                throw 'All fields are required!';
            }

            await login(data);
            context.updateNav();
            context.page.redirect('/');
        }

        form.reset();
    } catch (error) {
        const inputPassword = document.getElementById('password');
        inputPassword.value = '';
        notifyNoEvent(error);
    }
}

export async function onLogout(ctx) {
  await logout();
  ctx.updateNav();
  ctx.page.redirect("/");
}