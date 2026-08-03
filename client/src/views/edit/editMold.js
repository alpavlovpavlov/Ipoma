import { html } from 'https://unpkg.com/lit?module';

import { editMold, getById, sendDrawing } from '../../data/mold.js';
import { onSubmit } from '../../middlewears/submit.js';
import { titleChange } from '../../util/title.js';
import { showHideHRSNInput, showHidePitchInput } from "../../util/swowHideinputElement.js";
import { handleImputAndSelect, fileInput, inputValidation, inputSanitizer, editForm } from "../../util/changeElementState.js";
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
                            <input class="input-create" id="date" type="number" placeholder="" name="date" .value=${mold.date} min="1990" max="2099" />
                            <label>Year of manufactoring</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="producer" type="text" placeholder="" name="producer" .value=${mold.producer} />
                            <label>Mold producer</label>
                        </div>

                        <div class="input-group">
                            <input class="input-create" id="serialNumber" type="text" placeholder="" name="serialNumber" .value=${mold.serialNumber} />
                            <label>Mold number</label>
                        </div>

                        <div class="input-group select-group">
                            <select id="hotRunnerMan" class="option-create" type="text" name="hotRunnerMan">
                                <option value="" disabled selected>${mold.hotRunnerMan}</option>
                                <option>n.a.</option>
                                <option>Maenner</option>
                                <option>DME</option>
                                <option>Mold Masters</option>
                                <option>Husky</option>
                            </select>
                            <label>Hot-runner manufacturer</label>
                        </div>

                        ${mold.hotRunnerMan != 'n.a.'
                            ? html`
                                <div class="input-group" style="display:block;">
                                    <input class="input-create" id="hotRunnerSer" type="text" placeholder="" name="hotRunnerSer" .value=${mold.hotRunnerSer} />
                                    <label>Hot-runner number</label>
                                </div>
                            `
                            : html`
                                <div class="input-group" style="display:none;">
                                    <input class="input-create" id="hotRunnerSer" type="text" placeholder="" name="hotRunnerSer" .value=${mold.hotRunnerSer} />
                                    <label>Hot-runner number</label>
                                </div>
                            `
                        }
                        

                        <div class="input-group">
                            <input class="input-create" id="numberOfCavities" type="text" placeholder="" name="numberOfCavities" .value=${mold.numberOfCavities} />
                            <label>Number of cavities</label>
                        </div>

                        ${mold.numberOfCav > 1
                            ? html`
                                <div class="input-group" style="display:block;">
                                    <input class="input-create" id="pitchDistance" type="text" placeholder="" name="pitchDistance" .value=${mold.pitchDistance} />
                                    <label>Pitch distance, mm</label>
                                </div>
                            `
                            : html`
                                <div class="input-group" style="display:none;">
                                    <input class="input-create" id="pitchDistance" type="text" placeholder="" name="pitchDistance" .value=${mold.pitchDistance} />
                                    <label>Pitch distance, mm</label>
                                </div>
                            `
                        }
                        
                        <div class="input-group select-group">
                            <select type="text" name="wayOfInjection">
                                <option value="" disabled selected>${mold.wayOfInjection}</option>
                                <option>inside</option>
                                <option>outside</option>
                            </select>
                            <label>Way of injection</label>
                        </div>

                        <div class="input-group file-group not-required">
                            <input id="file" type="file" name="moldDrawing" accept="application/pdf" multiple hidden />
                            
                            <div class="file-box">
                                <span class="file-text">Choose files</span>
                                ${mold.moldDrawing.length > 0
                                    ? html`
                                        <span class="file-name">${mold.drawings}</span>
                                        <img id="file-preview" src="../../../images/pdf-icon.png" style="margin-top:10px; max-width:20px" type="application/pdf" />
                                    `
                                    : html`
                                        <span class="file-name">No file selected</span>
                                    `
                                }
                            </div>
                            <label class="floating-label">Upload drawings</label>
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

        mold.drawings = mold.moldDrawing.map(d => d.split('/').pop().split('___')[1]).join(' / ');
        ctx.render(editMoldTemplate(mold, false));

        showHideHRSNInput();
        showHidePitchInput();
        editForm();
        drawingGroup(mold);
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
    const numberOfCav = Number(data.numberOfCavities.split('+')[0]);

    console.log(numberOfCav, data.pitchDistance);

    try {
        if (!data) throw "All fields are required!";

        if (
            data.name == "" ||
            data.date == "" ||
            data.producer == "" ||
            data.serialNumber == "" ||
            data.hotRunnerMan == "" ||
            data.numberOfCavities == "" ||
            data.dataUrl == "" ||
            data.wayOfInjection == ""
        ) throw "All fields are required!";

        if (data.hotRunnerMan != "n.a." && data.hotRunnerSer == "") {
            throw "All fields are required";
        } else if (data.hotRunnerMan == "n.a.") {
            data.hotRunnerSer = "";
        }

        if (numberOfCav > 1 && data.pitchDistance == "") {
            throw "All fields are required";
        } else if (numberOfCav == 1) {
            data.pitchDistance = "";
        }

        if (files[0].name == '') {
            data.moldDrawing = mold.moldDrawing;
        } else {
            const uploadedFiles = await sendDrawing(formData);
            
            data.moldDrawing = uploadedFiles.moldDrawings;
        }

        const result = await editMold(moldId, data);
        
        context.page.redirect(`/mold-details/${result._itemId}`);
        form.reset();
    } catch (error) { 
        notifyNoEvent(error);
    }
}