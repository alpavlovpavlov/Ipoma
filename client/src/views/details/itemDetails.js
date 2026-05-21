import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getItem } from '../../data/item.js';
import { getUser } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { notify, notifyNoEvent } from '../notify.js';
import { roleAssignment } from '../../util/role.js'
import { deleteMoldAndItem } from '../../data/mold.js';

const itemDetailsTemplate = (item, isLoading, currentUser) => html`
    <section id="meme-details">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <h1 class="h1">${item.type} ${item.name}</h1>
                <h2 class="underline"></h2>
                <div class="meme-details">
                    <table class="files-table">
                        <thead>
                            <tr>
                                ${item.itemDrawing.length == 0
                                    ? html`
                                        <th>File Name</th>
                                        <th>Action</th>
                                    `
                                    : html`
                                        <th></th>
                                        <th>Content</th>
                                        <th>File Name</th>
                                        ${currentUser.role != 'guest'
                                            ? html`<th>Action</th>`
                                            : null
                                        }
                                    `
                                }
                            </tr>
                        </thead>

                        ${item.itemDrawing.length > 0
                            ? html`
                                <tbody>
                                    ${item.itemDrawing.map((file) => tableTemplate(file, true, currentUser.role))}
                                    ${tableTemplate(item.tds, false, currentUser.role)}
                                </tbody>
                            `
                            : html`<h3 class="heading3">No drawings available</h3>`
                        }
                    </table>
                    
                    <div class="meme-description-mold">
                        <h2>Details</h2>
                        <p><strong>Shape</strong> ${item.shape}</p>
                        <p><strong>Type</strong> ${item.type}</p>
                        <p><strong>Cavity numbers</strong> ${item.cavityNumbers}</p>
                        <p><strong>Volume</strong> ${item.volume} ml</p>
                        <p><strong>Weight</strong> ${item.weight} gr</p>

                        <div class="buttons-row">
                            ${currentUser.role == 'ipoma-user' || currentUser.role == 'admin'
                                ? html`<a class="button" href="/details/${item._id}">< Back</a>`
                                : html`<a class="button" href="/${item.type.toLowerCase()}s-catalog/${item.shape}">< Back</a>`
                            }
                            <a class="button" href="/item-options/${item._id}">Options</a>
                            ${currentUser.isCreator || currentUser.role == 'admin'
                                ? html`
                                    <a class="button warning" href="/edit-item/${item._id}">Edit</a>
                                    <button class="button danger" @click=${onDelete}>Delete</button>`
                                : null
                            }
                        </div>
                    </div>
                </div>
                <div class="meme-img">
                    <img alt="meme-alt" src="${item.image}">
                </div>
            `
        }
    </section>
`;

const tableTemplate = (file, dr, role) => html`
    <tr>
        <td>
            <img src="/images/pdf-icon.png" width="24">
        </td>

        ${dr
            ? html`<td>Drawing</td>`
            : html`<td>TDS</td>`
        }    

        ${role != 'guest'
            ? html`<td class="point" @click=${() => view(file)}>${file.split('/').pop()}</td>`
            : html`<td class="point" @click=${(e) => notify('Please register or login to have accesss to the full functionality', e)}>${file.split('/').pop()}</td>`
        }

        <td>
            <div class="actions">
                ${role != 'guest'
                    ? html`
                        <button @click=${() => view(file)}>View</button>
                        <a href="{file}">Download</a>
                    `
                    : null
                }
                
            </div>
        </td>
    </tr>
`;

let context = null;
let item = {};
let itemId = null;

export async function itemDetailsPage(ctx) {
    titleChange('Item Details Page');
    context = ctx;
    itemId = ctx.params.itemId;
    const user = getUser();
    
    try {
        ctx.render(itemDetailsTemplate({}, true));

        item = await getItem(itemId);

        const currentUser = roleAssignment(user, item);

        ctx.render(itemDetailsTemplate(item, false, currentUser));
    } catch (error) {
        notifyNoEvent(error);
    }
}

function download(file) {
    const content = file.split('/');
    
    if (content.length == 4) {
        //downloadDrawing(content[2], content[3], false);
    } else if (content.length == 5) {
        //downloadDrawing(content[2], content[4], true);
    }
}

function view(file) {
    window.open(`${file}`, "_blank");
}

async function onDelete() {
    const choice = confirm(`You are about to delete both, item and mold ${item.name}. Are you sure?`);

    if(choice) {
        try {
            await deleteMoldAndItem(itemId);

            context.page.redirect(`/${item.type}s-catalog/${item.shape}`);
        } catch (error) {
            notifyNoEvent(error);
        }
    }
}