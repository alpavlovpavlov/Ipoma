import { html } from 'https://unpkg.com/lit?module';

import { editMold, getById, sendDrawing } from '../../data/mold.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { handleImputAndSelect, fileInput, pdfPreview, inputValidation, editForm } from "../../util/changeElementState.js";
import { drawingGroup } from '../../util/drawingGroupActivation.js';
import { notifyNoEvent } from '../notify.js';

const editMoldTemplate = (mold, isLoading) => html`
    <section id="edit-meme">
        ${isLoading
            ? html`<h3>Loading &hellip;</h3>`
            : html`
                <form id="create-form" @submit=${onEdit}>
                    <h1>Edit Mold</h1>
                    <div class="form-group-edit">
                        <div class="input-group">
                            <input class="input-create" id="name" type="text" placeholder="" name="name" .value=${mold.name} disabled="true" >
                            <label>Name</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="date" type="month" name="date" .value=${mold.date}>
                            <label>Enter manufactoring date</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="producer" type="text" placeholder="M" name="producer" .value=${mold.producer} />
                            <label>Mold producer</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="serialNumber" type="text" placeholder="" name="serialNumber" .value=${mold.serialNumber} />
                            <label>Mold number</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="hotRunnerMan" type="text" placeholder="" name="hotRunnerMan" .value=${mold.hotRunnerMan} />
                            <label>Hot-runner producer</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="hotRunnerSer" type="text" placeholder="" name="hotRunnerSer" .value=${mold.hotRunnerSer} />
                            <label>Hot-runner number</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="numberOfCavities" type="number" placeholder="" name="numberOfCavities" .value=${mold.numberOfCavities} />
                            <label>Number of cavities</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="pitchDistance" type="text" placeholder="" name="pitchDistance" .value=${mold.pitchDistance} />
                            <label>Pitch distance, mm</label>
                        </div>

                        <!-- ${mold.moldDrawing.length > 0
                            ? html`
                                <label class="file-label-edit">Drawing</label>
                                <label class="file-label" id="filename6" for="itemdrawing6">${mold.drawings}</label>
                                <input class="input-create" id="itemdrawing6" type="file" name="moldDrawing" accept="application/pdf">
                            `
                            : html`
                                <label class="file-label-edit" for="itemdrawing6">Drawing</label>
                                <label class="file-label" id="filename6" for="itemdrawing6">No file selected</label>
                                <input class="input-create" id="itemdrawing6" type="file" name="moldDrawing" accept="application/pdf">
                            `
                        } -->

                        <div class="input-group file-group not-required">
                            <input id="file" type="file" name="moldDrawing" accept="application/pdf" multiple hidden />
                            
                            <div class="file-box">
                                <span class="file-text">Choose files</span>
                                ${mold.moldDrawing
                                    ? html`
                                        <span class="file-name">${mold.drawings}</span>
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

                        <div class="input-group select-group">
                            <select type="text" name="wayOfInjection">
                                <option value="" disabled selected>${mold.wayOfInjection}</option>
                                <option>inside</option>
                                <option>outside</option>
                            </select>
                            <label>Way of injection</label>
                        </div>

                        <input type="submit" class="registerbtn button" value="Edit mold">
                        <a class="button" href="/mold-details/${mold._itemId}">< Back</a>
                    </div>
                </form>
            `
        }
    </section>
`;

let context = null;
let moldId = null;
let mold = {};

export async function editMoldPage(ctx) {
    context = ctx;
    moldId = ctx.params.moldId;
    titleChange('Edit Mold Page');

    try {
        ctx.render(editMoldTemplate({}, true));

        mold = await getById(moldId);

        mold.drawings = mold.moldDrawing.map(d => d.split('/')[3]).join(' / ');
        
        ctx.render(editMoldTemplate(mold, false));

        editForm();
        drawingGroup(mold);
        pdfPreview('file');
        fileInput();
        handleImputAndSelect();
        inputValidation();
    } catch (error) {
        notifyNoEvent(error);
    }
}

async function onEdit(event) {
    const { data, form, formData } = onSubmit(event);
    const files = formData.getAll('moldDrawing');
    const [year, month] = data.date.split('-');
    
    data.date = `${year}-${month}`;

    try {
        if (!data) throw "All fields are required!";

        if (
            data.name == "" ||
            data.date == "" ||
            data.producer == "" ||
            data.serialNumber == "" ||
            data.hotRunnerMan == "" ||
            data.hotRunnerSer == "" ||
            data.numberOfCavities == "" ||
            data.pitchDistance == "" ||
            data.dataUrl == "" ||
            data.wayOfInjection == ""
        ) throw "All fields are required!";

        if (files[0].name == '') {
            data.moldDrawing = mold.moldDrawing;
        } else {
            data.moldDrawing = [];
            files.forEach(element => {
                data.moldDrawing.push(`uploads/drawings/mold/${element.name}`);
            })
        }

        if (files.length > 0) {
            await sendDrawing(formData);
        }

        const result = await editMold(moldId, data);
        
        context.page.redirect(`/mold-details/${result._itemId}`);
        form.reset();
    } catch (error) { 
        notifyNoEvent(error);
    }
}