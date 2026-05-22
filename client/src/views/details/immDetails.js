import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getById, deleteIMM } from '../../data/imm.js';
import { getItem } from '../../data/item.js';
import { getUser } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';
import { roleAssignment } from '../../util/role.js';

const immDetailsTemplate = (imm, isLoading, items, currentUser) => html`
    <section id="meme-details">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <h1 class="h1">Machine: ${imm.producer} ${imm.label}</h1>
                <h2 class="underline"></h2>
                <div class="meme-details">
                    <table class="files-table">
                        <thead>
                            <tr>
                                ${imm.immDrawing.length == 0
                                    ? html`
                                        <th>File Name</th>
                                    `
                                    : html`
                                        <th></th>
                                        <th>File Name</th>
                                        <th>Actions</th>
                                    `
                                }
                            </tr>
                        </thead>

                        ${imm.immDrawing.length > 0
                            ? html`
                                <tbody>
                                    ${imm.immDrawing.map(file => html`
                                        <tr>
                                            <td>
                                                <img src="/images/pdf-icon.png" width="24">
                                            </td>
                                            <td class="point" @click=${() => view(file)}>${file.split('/').pop()}</td>
                                            <td>
                                                <div class="actions">
                                                    <button @click=${() => view(file)}>View</button>
                                                    <a href="${imm.immDrawing}" target="_blank">Download</a>
                                                </div>
                                            </td>
                                        </tr>
                                    `)}
                                </tbody>
                            `
                            : html`<h3 class="heading3">No drawings available</h3>`
                        }
                    </table>
                    
                    <div class="meme-description-mold">
                        <h2>Details</h2>
                        <p><strong>Machine description:</strong> ${imm.description}</p>
                        <p><strong>Ipoma identification:</strong> ${imm.label}</p>
                        <p><strong>Serial number:</strong> ${imm.immNumber}</p>
                        <p><strong>Year of manufactoring:</strong> ${imm.date}</p>
                        <p><strong>Clamping force:</strong> ${imm.force} t</p>
                        <p><strong>Injection unit:</strong> ${imm.injectionUnit}</p>
                        <p><strong>Type:</strong> ${imm.type}</p>

                        <div class="buttons-row">
                            <a class="button no-warning" href="/imms-catalog">< Back</a>
                            <button class="button no-warning" @click=${showItems} id="items-toggle">Show items</button>
                            ${currentUser.isCreator || currentUser.role == 'admin'
                                ? html`
                                    <a class="button warning" href="/edit-imm/${imm._id}">Edit</a>
                                    <button class="button danger" @click=${onDelete}>Delete</button>`
                                : null
                            }
                        </div>
                    </div>
                
                    <div class="wrap-table" id="imm-right-table" style="display: none;">
                        ${items.length > 0
                            ? html`
                                <table class="right-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Items</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        ${items.map(item => html`
                                            <tr>
                                                <td>
                                                    <img src="${host}/${item.image}" width="24">
                                                </td>

                                                <td class="clickable" @click=${() => itemDtls(item._id)}>${item.name}</td>
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                            `
                            : html`<h3 class="heading3">No items registered on this machine</h3>`
                        }
                    </div>
                </div>
            `
        }
    </section>
`;

let context = null;
let imm = {};
let immId = null;

export async function immDetailsPage(ctx) {
    titleChange('IMM Details Page');
    context = ctx;
    immId = ctx.params.immId;

    ctx.render(immDetailsTemplate({}, true));
    try {
        imm = await getById(immId);
        console.log(imm.immDrawing);
        
        const user = getUser();
        const currentUser = roleAssignment(user, imm);
        const items = [];

        for (let i = 0; i < imm.options.length; i++) {
            const currentItem = await getItem(imm.options[i].item);
            items.push(currentItem);
        }
        
        ctx.render(immDetailsTemplate(imm, false, items, currentUser));
    } catch (error) {
        notifyNoEvent(error);
    }
}

function view(file) {
    window.open(`${host}/${file}`, "_blank");
}

function itemDtls(itemId) {
    context.page.redirect(`/item-details/${itemId}`);
}

async function showItems() {
    const button = document.getElementById('items-toggle');
    const div = document.getElementById('imm-right-table');
    
    if(div.style.display == 'none') {
        div.style.display = 'table';
        button.textContent = 'Hide items';
    } else {
        div.style.display = 'none';
        // table.removeAttribute('style');
        button.textContent = 'Show items';
    }
}

async function onDelete() {
    const choice = confirm(`You are about to delete IMM ${imm.producer} ${imm.label}. Are you sure?`);

    if(choice) {
        try {
            await deleteIMM(immId);
    
            context.page.redirect('/imms-catalog');
        } catch (error) {
            notifyNoEvent(error);
        }
    }
}