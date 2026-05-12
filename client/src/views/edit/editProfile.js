import { html } from '../../../node_modules/lit-html/lit-html.js';

import { getUser } from '../../util/util.js';
import { onSubmit } from '../../middlewears/submit.js';
import { editProfile } from '../../data/auth.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';

const editProfileTemplate = (user) => html`
    <section id="edit-meme">
        <form id="edit-form" @submit=${onEdit}>
            <h2 class="chng-h2">Edit profile</h2>
            <div class="container">
                <label for="name">Name</label>
                <input class="input-create" id="name" type="text" placeholder="Enter name" name="username" .value=${user.username} >

                <label for="email">Email</label>
                <input class="input-create" id="email" type="text" placeholder="Cavity numbers" name="email" .value=${user.email} />
                <div class="buttons-row">
                    <a href="/profile" type="submit" class="button">Cancel</a>
                    <button type="submit" class="button warning">Edit Profile</button>
                </div>
            </div>
        </form>
    </section>
`;

let user = null;
let context = null;

export async function editProfilePage(ctx) {
    user = getUser();
    context = ctx;
    titleChange('Edit Profile Page');
    ctx.render(editProfileTemplate(user));
}

async function onEdit(event) {
    const choice = confirm('Are you sure?');

    if (!choice) return;
    const { data, form } = onSubmit(event);

    try {
        if(data) {
            if (data.username == "" || data.email == "") {
                throw "All fields are required!";
            };
        }

        const payload = {
            userId: user._id,
            data
        }

        await editProfile(payload);
        context.updateNav();
        context.page.redirect('/profile');
        
        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}