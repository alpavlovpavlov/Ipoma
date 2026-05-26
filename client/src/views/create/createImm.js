import { html } from 'https://unpkg.com/lit?module';

import { onSubmit } from '../../middlewears/submit.js';
import { createIMM, saveDrawing } from '../../data/imm.js';
import { getUser } from '../../util/util.js';
import { titleChange } from '../../util/title.js';
import { handleImputAndSelect, fileInput, pdfPreview, inputValidation, inputSanitizer } from "../../util/changeElementState.js";
import { notifyNoEvent } from '../notify.js';

const immTemplate = () => html`
    <section id="create-item">
        <form class="two-columns-form" id="create-form" @submit=${onCreate}>
            <div class="form-group">
                <h1>IMM data</h1>
                <div class="input-group">
                    <input class="input-create" id="producer" type="text" placeholder="" name="producer">
                    <label>Producer</label>
                </div>

                <div class="input-group">
                    <input class="input-create" type="text" placeholder="" name="description" />
                    <label>Machine designation</label>
                </div>

                <div class="input-group">
                    <input class="input-create" type="text" placeholder="" name="label" />
                    <label>Ipoma assed identification</label>
                </div>
                
                <div class="input-group">
                    <input class="input-create" type="number" placeholder="" name="date" min="1990" max="2099" />
                    <label>Year of manufacturing</label>
                </div>
                 
                <div class="input-group">
                    <input class="input-create" id="immNumber" type="text" placeholder="" name="immNumber" />
                    <label>Serial number</label>
                </div>

                <div class="input-group">
                    <input class="input-create" id="force" type="number" placeholder="" name="force" />
                    <label>Clamping force, t</label>
                </div>

                <div class="input-group select-group">
                    <select class="option-create" type="text" name="injectionUnit">
                        <option value="" disabled selected>--Select--</option>
                        <option>Single</option>
                        <option>2K</option>
                    </select>
                    <label>Injection unit type</label>
                </div>

                <div class="input-group select-group">
                    <select class="option-create" id="type" type="text" name="type">
                        <option value="" disabled selected>--Select--</option>
                        <option>Hydraulic</option>
                        <option>Hybrid</option>
                        <option>Fully electric</option>
                    </select>
                    <label>Machine type</label>
                </div>

                <div class="input-group file-group not-required">
                    <input id="drawing" type="file" name="immDrawing" accept="application/pdf" multiple hidden />
                    
                    <div class="file-box">
                        <span class="file-text">Choose files</span>
                        <span class="file-name">No file selected</span>
                        <img id="drawing-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
                    </div>

                    <label class="floating-label">Upload drawings</label>
                </div>

                <input type="submit" class="registerbtn button" value="Create IMM">
            </div>
    </section>
`;

let context = null;

export function createImmPage(ctx) {
    titleChange('Create IMM Page');
    context = ctx;

    ctx.render(immTemplate());
    pdfPreview('drawing');
    fileInput();
    handleImputAndSelect();
    inputSanitizer();
    inputValidation();
}

async function onCreate(event) {
    const { data, form, formData } = onSubmit(event);
    const user = getUser();

    try {
        if(data) {
            if(
                data.producer == '' ||
                data.description == '' ||
                data.label == '' ||
                data.date == '' ||
                data.immNumber == '' ||
                data.force == '' ||
                data.injectionUnit == '' ||
                data.type == ''
            ) {
                throw 'All fields in red are required!';
            }

            let imm = Object.assign({ _ownerId: user._id }, data);

            const uploadedFiles = await saveDrawing(formData);
            
            imm.immDrawing = uploadedFiles.immDrawings;

            await createIMM(imm);
            context.page.redirect('/imms-catalog');
        }
        form.reset();
    } catch (error) {
        notifyNoEvent(error);
    }
}