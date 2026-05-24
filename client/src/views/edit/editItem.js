import { html } from 'https://unpkg.com/lit?module';

import { host } from '../../data/api.js';
import { editItem, getItem, sendDrawing } from '../../data/item.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { handleImputAndSelect, fileInput, pdfPreview, inputValidation, editForm, imagePreview } from "../../util/changeElementState.js";
import { drawingGroup } from '../../util/drawingGroupActivation.js';
import { notifyNoEvent } from '../notify.js';

const editItemTemplate = (item, isLoading) => html`
    <section id="edit-meme">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <form id="create-form" @submit=${onEdit}>
                    <h1>Edit item</h1>
                    <div class="form-group-edit">
                        <div class="input-group">
                            <input class="input-create" type="text" placeholder="" name="name" .value=${item.name} disabled="true" >
                            <label>Name</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" type="text" placeholder="" name="cavityNumbers" .value=${item.cavityNumbers} >
                            <label>Cavity numbers</label>
                        </div>

                        <div class="input-group select-group">
                            <select type="text" name="shape">
                                <option value="" disabled selected>${item.shape}</option>
                                <option>Round</option>
                                <option>Square</option>
                                <option>Rectangular</option>
                                <option>Oval</option>
                                <option>Ather</option>
                            </select>
                            <label>Shape</label>
                        </div>

                        <div class="input-group select-group">
                            <select type="text" name="type">
                                <option value="" disabled selected>${item.type}</option>
                                <option>Container</option>
                                <option>Lid</option>
                                <option>Handle</option>
                            </select>
                            <label>Type</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="volume" type="number" step="0.01" placeholder="" name="volume" .value="${item.volume}" >
                            <label>Volume, ml</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="weight" type="number" step="0.01" placeholder="" name="weight" .value="${item.weight}" >
                            <label>Weight, gr</label>
                        </div>

                        <div class="input-group file-group">
                            <input id="image" type="file" name="image" accept="image/*" hidden />

                            <div class="file-box">
                                <span class="file-text">Choose file</span>
                                ${item.image != ''
                                    ? html`
                                        <span class="file-name">${item.image.split('/')[2]}</span>
                                        <img id="image-preview" style="margin-top:10px; max-width:40px;" src="${host}/${item.image}" />
                                    `
                                    : html`
                                        <span class="file-name">No file selected</span>
                                        <img id="image-preview" style="margin-top:10px; max-width:40px;" />
                                    `
                                }
                            </div>

                            <label>Upload an image</label>
                        </div>

                        <div class="input-group file-group not-required">
                            <input id="file" type="file" name="itemDrawing" accept="application/pdf" multiple hidden />
                            
                            <div class="file-box">
                                <span class="file-text">Choose drawings</span>
                                ${item.drawings
                                    ? html`
                                        <span class="file-name">${item.drawings}</span>
                                        <img id="file-preview" src="../../../images/pdf-icon.png" style="margin-top:10px; max-width:20px" type="application/pdf" />
                                    `
                                    : html`
                                        <span class="file-name">No file selected</span>
                                        <img id="file-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                                    `
                                }
                            </div>
                            <label class="floating-label">Upload drawings</label>
                        </div>

                        <div class="input-group file-group">
                            <input id="tds" type="file" name="tds" accept="application/pdf" multiple hidden />
                            
                            <div class="file-box">
                                <span class="file-text">Choose tds file</span>
                                ${item.tds
                                    ? html`
                                        <span class="file-name">${item.tds.split('/').pop().split('-').slice(1)}</span>
                                        <img id="tds-preview" src="../../../images/pdf-icon.png" style="margin-top:10px; max-width:20px" type="application/pdf" />
                                        `
                                    : html`
                                        <span class="file-name">No file selected</span>
                                        <img id="tds-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                                    `
                                }
                            </div>
                            <label class="floating-label">Upload drawings</label>
                        </div>

                        <input type="submit" class="registerbtn button" value="Edit Item">
                        <a class="button" href="/item-details/${item._id}">< Back</a>
                    </div>
                </form>
            `
        }
    </section>
`;

let context = null;
let itemId = null;
let item = {};

export async function editItemPage(ctx) {
    titleChange('Edit Item Page');
    context = ctx;
    itemId = ctx.params.itemId;

    try {
        ctx.render(editItemTemplate({}, true));

        item = await getItem(itemId);

        item.drawings = item.itemDrawing.map(d => d.split('/').pop().split('-').slice(1)).join(' / ');

        ctx.render(editItemTemplate(item, false));

        editForm();
        drawingGroup(item);
        imagePreview();
        pdfPreview('file');
        pdfPreview('tds');
        fileInput();
        handleImputAndSelect();
        inputValidation();
    } catch (error) {
        notifyNoEvent(error);
    }
}

async function onEdit(event) {
    const { data, form, formData } = onSubmit(event);
    const image = formData.get('image');
    const tds = formData.get('tds');
    const files = formData.getAll('itemDrawing');

    try {
        if(data) {
            if (
                data.name == "" ||
                data.shape == "" ||
                data.cavityNumbers == "" ||
                data.volume == "" ||
                data.weight == ""
            ) {
                throw "All fields in red are required!";
            }

            if (image && image.size > 0 || tds && tds.size > 0 || files[0].name != '') {
                const uploadedFiles = await sendDrawing(formData);

                if (!image || image.size == 0) {
                    data.image = item.image;
                } else {
                    data.image = uploadedFiles.image;
                }
    
                if (!tds || tds.size == 0) {
                    data.tds = item.tds;
                } else {
                    data.tds = uploadedFiles.tds;
                }
    
                if (files[0].name == '') {
                    data.itemDrawing = item.itemDrawing;
                } else {
                    data.itemDrawing = uploadedFiles.itemDrawings;
                }

            }

            await editItem(itemId, data);
            
            context.page.redirect(`/item-details/${itemId}`);
        }
        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}