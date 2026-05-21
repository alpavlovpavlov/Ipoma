import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { getUser } from '../../util/util.js';
import { getItem } from '../../data/item.js';
import { deleteMoldAndItem, getMoldByItemId } from '../../data/mold.js';
import { titleChange } from '../../util/title.js';
import { notifyNoEvent } from '../notify.js';
import { roleAssignment } from '../../util/role.js';

const moldDetalsTemplate = (mold, isLoading, currentUser) => html`
    <section id="meme-details">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <h1 class="h1">Mold ${mold.name}</h1>
                <h2 class="underline"></h2>
                <div class="meme-details">
                    <table class="files-table">
                        <thead>
                            <tr>
                                ${mold.moldDrawing.length == 0
                                    ? html`
                                        <th>File Name</th>
                                        <th>Action</th>
                                    `
                                    : html`
                                        <th></th>
                                        <th>File Name</th>
                                        ${currentUser.role != 'guest'
                                            ? html`<th>Action</th>`
                                            : null
                                        }
                                    `
                                }
                            </tr>
                        </thead>

                        ${mold.moldDrawing.length > 0
                            ? html`
                                <tbody>
                                    ${mold.moldDrawing.map(file => html`
                                        <tr>
                                            <td>
                                                <img src="/images/pdf-icon.png" width="24">
                                            </td>
                                            ${currentUser != 'guest'
                                                ? html`<td class="point" @click=${() => view(file)}>${file.split('/').pop()}</td>`
                                                : html`<td class="point" @click=${(e) => notify('Please register or login to have accesss to the full functionality', e)}>${file.split('/').pop()}</td>`
                                            }
                                            
                                            <td>
                                                <div class="actions">
                                                    ${currentUser.role != 'guest'
                                                        ? html`
                                                            <button @click=${() => view(file)}>View</button>
                                                            <button @click=${() => download(file)}>Download</button>
                                                        `
                                                        : null
                                                    }
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
                        <p><strong>Year of manufactoring: </strong>${mold.date}</p>
                        <p><strong>Number of cavities: </strong>${mold.numberOfCavities}</p>
                        <p><strong>Manufacturer: </strong>${mold.producer}</p>
                        
                        ${mold.hotRunnerMan !== 'n.a.'
                            ? html`<p><strong>Serial number: </strong>${mold.serialNumber}</p>`
                            : null
                        }

                        <p><strong>Hot-runner: </strong>${mold.hotRunnerMan}</p>
                   
                        ${mold.hotRunnerMan !== 'n.a.'
                            ? html`<p><strong>Hot-runner serial number: </strong>${mold.hotRunnerSer}</p>`
                            : null
                        }
                        
                        ${mold.pitchDistance
                            ? html`<p><strong>Pitch distance: </strong>${mold.pitchDistance}</p>`
                            : null
                        }
                        
                        <p><strong>Injection from: </strong>${mold.wayOfInjection}</p>
                        <div class="buttons-row">
                            <a class="button" href="/details/${mold._itemId._id}">< Back</a>
                            
                            ${currentUser.isCreator || currentUser.role == 'admin'
                                ? html`
                                    <a class="button warning" href="/edit-mold/${mold._id}">Edit</a>
                                    <button class="button danger" @click=${onDelete}>Delete</button>`
                                : null
                            }
                        </div>
                    </div>
                </div>
            `
        }
    </section>
`;

let mold = {};
let itemId = null;
let context = null;

export async function moldDetailsPage(ctx) {
    titleChange('Mold Details Page');
    context = ctx;
    itemId = ctx.params.itemId;
    ctx.render(moldDetalsTemplate({}, true));
    const user = getUser();
    
    try {
        mold = await getMoldByItemId(itemId);
        
        const currentUser = roleAssignment(user, mold);
        
        ctx.render(moldDetalsTemplate(mold, false, currentUser));
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
    window.open(`${host}/${file}`, "_blank");
}

async function onDelete() {
    const choice = confirm(`You are about to delete both, item and mold ${mold.name}. Are you sure?`);

    if(choice) {
        try {
            const item = await getItem(itemId);
            await deleteMoldAndItem(itemId);
    
            context.page.redirect(`/${item.type}s-catalog/${item.shape}`);
        } catch (error) {
            notifyNoEvent(error);
        }
    }
}