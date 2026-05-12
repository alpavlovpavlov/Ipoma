import { html } from '../../../node_modules/lit-html/lit-html.js';

import { getUser } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';
import { deleteUser } from '../../data/auth.js';

const profileTemplate = (user) => html`
    <section id="user-profile-page" class="user-profile">
        <div id="modify">
            <article class="user-info" id="article">
                ${user.role == 'admin'
                    ? html`<img id="user-avatar-url" alt="user-profile" src="/images/admin.webp">`
                    : ''
                }
                <div class="user-content">
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>
            </article>
            <h2 id="user-listings-title"></h2>
            <button class="button" id="modify-btn" @click=${onModify}>Modify</button>
        </div>

        <div class="container" id="edit-profile" hidden="true">
            <p id="name" type="text" placeholder="Enter name" name="name">Name: ${user.username}</p>
            <p id="cavityNumbers" type="text" placeholder="Cavity numbers" name="cavityNumbers">Email: ${user.email} </p>
            <div class="buttons-row">
                <button class="button" @click=${back}>< Back</button>
                <a href="/chg-pass" class="button warning">Change Password</a>
                <a href="/edit-profile" class="button warning" id="editMail-btn">Edit</a>
                <button class="button danger" @click=${onDelete}>Delete</button>
            </div>
        </div>
    </section>
`;

let context = null;
let user = null;

export async function profilePage(ctx) {
    context = ctx;
    titleChange('Profile Page');
    user = getUser();
    
    if (user != null) {
        ctx.render(profileTemplate(user));
    }
}

function onModify() {
    const div1 = document.getElementById('modify');
    const div2 = document.getElementById('edit-profile');

    div1.setAttribute('hidden', '');
    div2.removeAttribute('hidden');
}

function back() {
    const div1 = document.getElementById('modify');
    const div2 = document.getElementById('edit-profile');

    div1.removeAttribute('hidden');
    div2.setAttribute('hidden', '');
}

async function onDelete() {
    const choice = confirm('Are you sure you want to delete the user profile?');

    if (!choice) return;

    try {
        await deleteUser(user._id);

        localStorage.removeItem('userData');
        context.updateNav();
        context.page.redirect('/');
    } catch (error) {
        notifyNoEvent(error);
    }
}