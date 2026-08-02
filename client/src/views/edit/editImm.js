import { html } from 'https://unpkg.com/lit?module';

import { editIMM, getById, saveDrawing } from "../../data/imm.js";
import { onSubmit } from "../../middlewears/submit.js";
import { titleChange } from "../../util/title.js";
import { handleImputAndSelect, fileInput, pdfPreview, inputValidation, inputSanitizer, editForm } from "../../util/changeElementState.js";
import { drawingGroup } from "../../util/drawingGroupActivation.js";
import { notifyNoEvent } from "../notify.js";

const editImmTemplate = (imm, isLoading) => html`
    <section id="edit-meme">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <form id="create-form" @submit=${onEdit}>
                    <h1>Edit IMM</h1>
                    <div class="form-group-edit">
                        <div class="input-group">
                            <input class="input-create" id="producer" type="text" placeholder="" name="producer" .value=${imm.producer} />
                            <label>Producer</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="description" type="text" placeholder="" name="description" .value=${imm.description} />
                            <label>Machine description</label>
                        </div>
                        
                        <div class="input-group">
                            <input class="input-create" id="label" type="text" placeholder="" name="label" .value=${imm.label} />
                            <label>Ipoma assed identification</label>
                        </div>
                        
                        <div class="input-group">
                            <input class="input-create" id="date" type="number" placeholder="" name="date" .value=${imm.date} min="1990" max="2099" />
                            <label>Year of manufactoring</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="serialNumber" type="text" placeholder="" name="immNumber" .value=${imm.immNumber} />
                            <label>IMM serial number</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="force" type="number" placeholder="" name="force" .value=${imm.force} />
                            <label>Clamping force</label>
                        </div>

                        <div class="input-group select-group">
                            <select class="option-create" type="text" name="injectionUnit">
                                <option value="" disabled selected>${imm.injectionUnit}</option>
                                <option>Single</option>
                                <option>2K</option>
                            </select>
                            <label>Injection unit</label>
                        </div>

                        <div class="input-group select-group">
                            <select type="text" name="type">
                                <option value="" disabled selected>${imm.type}</option>
                                <option>Hydraulic</option>
                                <option>Hybrid</option>
                                <option>Fully electric</option>
                            </select>
                            <label>Type</label>
                        </div>

                        <div id="datasheet-group" class="input-group file-group not-required">
                            <input id="dataSheet" type="file" name="immDataSheet" accept="application/pdf" multiple hidden />
                            
                            <div class="file-box">
                                <span class="file-text">Choose files</span>
                                ${imm.immDataSheet.length > 0
                                    ? html`
                                        <span class="file-name">${imm.datasheets}</span>
                                        <img id="dataSheet-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                                        `
                                    : html`
                                        <span class="file-name">No file selected</span>
                                        <img id="dataSheet-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                                    `
                                }
                            </div>

                            <label class="floating-label">Upload data sheet</label>
                        </div>

                        <div id="drawing-group" class="input-group file-group not-required">
                            <input id="file" type="file" name="immDrawing" accept="application/pdf" multiple hidden />
                            
                            <div class="file-box">
                                <span class="file-text">Choose files</span>
                                ${imm.drawings.length > 0
                                    ? html`
                                        <span class="file-name">${imm.drawings}</span>
                                        <img id="file-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                                        `
                                    : html`
                                        <span class="file-name">No file selected</span>
                                        <img id="file-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                                    `
                                }
                            </div>

                            <label class="floating-label">Upload drawings</label>
                        </div>

                        <input type="submit" class="registerbtn button" value="Edit IMM"/>
                        <a class="button" href="/imm-details/${imm._id}">Cancel</a>
                    </div>
                </form>
            `
        }
    </section>
`;

let context = null;
let immId = null;
let imm = {};

export async function editImmPage(ctx) {
    titleChange("Edit IMM Page");
    context = ctx;
    immId = ctx.params.immId;

    try {
        ctx.render(editImmTemplate({}, true));

        imm = await getById(immId);

        imm.datasheets = imm.immDataSheet.map(d => d.split('/').pop().split('___')[1]).join(' / ');
        imm.drawings = imm.immDrawing.map(d => d.split('/').pop().split('___')[1]).join(' / ');

        ctx.render(editImmTemplate(imm, false));

        editForm();
        drawingGroup(imm);
        pdfPreview('file');
        pdfPreview('ds');
        fileInput();
        handleImputAndSelect();
        inputSanitizer();
        inputValidation();
    } catch (error) {
        notifyNoEvent(error);
    }
}

async function onEdit(event) {
    const { data, form, formData } = onSubmit(event);
    const files = formData.getAll("immDrawing");
    const dataSheets = formData.getAll("immDataSheet");
    let uploadedFiles = {};

    try {
        if (data) {
        if (
            data.producer == "" ||
            data.description == "" ||
            data.label == "" ||
            data.date == "" ||
            data.immNumber == "" ||
            data.force == "" ||
            data.injectionUnit == '' ||
            data.type == ""
        ) {
            throw "All fields are required!";
        }

        if (dataSheets[0].name != '' || files[0].name != '') {
            uploadedFiles = await saveDrawing(formData);
        }

        if (dataSheets[0].name == '') {
            data.immDataSheet = imm.immDataSheet;
        } else {
            data.immDataSheet = uploadedFiles.immDataSheets;
        }

        if (files[0].name == '') {
            data.immDrawing = imm.immDrawing;
        } else { 
            data.immDrawing = uploadedFiles.immDrawings;
        }

        const result = await editIMM(immId, data);

        context.page.redirect(`/imm-details/${result._id}`);
    }
    form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}
