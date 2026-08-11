import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getItem, searchItem } from '../../data/item.js';
import { getUser } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { notify, notifyNoEvent } from '../notify.js';
import { roleAssignment } from '../../util/role.js'
import { deleteMoldAndItem } from '../../data/mold.js';

const itemDetailsTemplate = (item, isLoading, currentUser, relatedItems) => html`
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
                                ${item.itemDrawing.length == 0 && item.tds == 0
                                    ? html`
                                        <th>File Name</th>
                                    `
                                    : html`
                                        <th>File Type</th>
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

                        ${item.itemDrawing.length > 0 || item.tds.length > 0
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
                        <p><strong>Type:</strong> ${item.type}</p>
                        <p><strong>Shape:</strong> ${item.shape}</p>
                        <p><strong>Cavity numbers:</strong> ${item.cavityNumbers}</p>

                        ${item.type === "Container"
                            ? html`<p><strong>Volume:</strong> ${item.volume} ml</p>`
                            : null
                        }
                        
                        <p><strong>Weight:</strong> ${item.weight} gr</p>

                        <div class="buttons-row">
                            ${currentUser.role == 'ipoma-user' || currentUser.role == 'admin'
                                ? html`<a class="button" href="/details/${item._id}">< Back</a>`
                                : html`<a class="button" href="/${item.type.toLowerCase()}s-catalog/${item.shape}">< Back</a>`
                            }
                            <a class="button" href="/item-options/${item._id}">Options</a>
                            <button class="button" @click=${showRelatedItems} id="related-toggle">Related items</button>
                            ${currentUser.isCreator || currentUser.role == 'admin'
                                ? html`
                                    <a class="button warning" href="/edit-item/${item._id}">Edit</a>
                                    <button class="button danger" @click=${onDelete}>Delete</button>`
                                : null
                            }
                        </div>
                    </div>

                    <div class="wrap-table" id="item-right-table" style="display: none;">
                        ${relatedItems.length > 0
                            ? html`
                                <table class="right-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Related items</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        ${relatedItems.map(item => html`
                                            <tr>
                                                <td>
                                                    <img src="${item.image}" width="24">
                                                </td>

                                                <td class="clickable" @click=${() => itemDtls(item._id)}>${item.name}</td>
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                            `
                            : html`<h3 class="heading3">No related items found</h3>`
                        }
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
            ? html`<td class="point" @click=${() => view(file)}>${file.split('/').pop().split('___')[1]}</td>`
            : html`<td class="point" @click=${(e) => notify('Please register or login to have accesss to the full functionality', e)}>${file.split('/').pop().split('___')[1]}</td>`
        }

        <td>
            <div class="actions">
                ${role != 'guest'
                    ? html`
                        <a href="${file}" target="_blank">View</a>
                        <a href="${getDownloadUrl(file)}">Download</a>
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

        const relatedItems = await matchItems();
        console.log(relatedItems);

        const currentUser = roleAssignment(user, item);

        ctx.render(itemDetailsTemplate(item, false, currentUser, relatedItems));
    } catch (error) {
        notifyNoEvent(error);
    }
}

function getDownloadUrl(url) {
    return url.replace('/upload/', '/upload/fl_attachment/');
}

function view(file) {
    window.open(`${file}`, "_blank");
}

function showRelatedItems() {
    const button = document.getElementById('related-toggle');
    const div = document.getElementById('item-right-table');
    
    if(div.style.display == 'none') {
        div.style.display = 'table';
        button.textContent = 'Hide related items';
    } else {
        div.style.display = 'none';
        button.textContent = 'Show related items';
    }
}

async function matchItems() {
    const core = item.name.split(' ')[1];
    const payload = { name: core };

    try {
        const searchResult = await searchItem(payload);

        return searchResult.filter(element => {
            const [, secondWord] = element.name.split(' ');
            return secondWord === core && element.type !== item.type;
        });
    } catch (error) {
        notifyNoEvent(error);
    }
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