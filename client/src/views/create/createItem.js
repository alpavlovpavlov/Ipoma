import { html } from 'https://unpkg.com/lit?module';

import { onSubmit } from "../../middlewears/submit.js";
import { sendDrawing } from "../../data/item.js";
import { getUser } from "../../util/util.js";
import { titleChange } from '../../util/title.js';
import { pdfPreview, fileInput, imagePreview, inputValidation, handleImputAndSelect } from "../../util/changeElementState.js";
import { notifyNoEvent } from "../notify.js";
import { removeSpaces } from '../../util/sanitizer.js';

const itemTemplate = () => html`
  <section id="create-item">
    <form class="two-columns-form" id="create-form" enctype="multipart/form-formData" @submit=${onCreate}>
      <div class="form-group">
        <h1>Item Data</h1>

        <div class="input-group">
          <input class="input-create" type="text" placeholder="" name="name" oninput="removeSpaces(this)" />
          <label>Item name</label>
        </div>

        <div class="input-group select-group">
          <select class="option-create" id="type" type="text" name="type">
            <option value="" disabled selected hidden>--Select--</option>
            <option>Container</option>
            <option>Lid</option>
            <option>Handle</option>
          </select>
          <label>Item type</label>
        </div>

        <div class="input-group select-group">
          <select class="option-create" type="text" name="shape">
            <option value="" disabled selected hidden>--Select--</option>
            <option>Round</option>
            <option>Square</option>
            <option>Rectangular</option>
            <option>Oval</option>
            <option>Other</option>
          </select>
          <label>Item shape</label>
        </div>

        <div class="input-group">
          <input class="input-create" id="volume" type="number" step="0.01" placeholder="" name="volume" />
          <label>Item volume, ml</label>
        </div>

        <div class="input-group">
          <input class="input-create" id="weight" type="number" step="0.01" placeholder="" name="weight" />
          <label>Item weight, gr</label>
        </div>

        <div class="input-group">
          <input class="input-create" id="cavityNumbers" type="text" placeholder="" name="cavityNumbers" />
          <label>Cavity numbers</label>
        </div>
        
        <div class="input-group file-group">
          <input id="image" type="file" name="image" accept="image/*" hidden />

          <div class="file-box">
            <span class="file-text">Choose file</span>
            <span class="file-name">No file selected</span>
            <img id="image-preview" style="display:none; margin-top:10px; max-width:40px;" />
          </div>

          <label>Upload an image</label>
        </div>

        <div class="input-group file-group not-required">
          <input id="drawing" type="file" name="itemDrawing" accept="application/pdf" multiple hidden />
          
          <div class="file-box">
            <span class="file-text">Choose files</span>
            <span class="file-name">No file selected</span>
            <img id="drawing-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
          </div>
          
          <label>Upload drawings</label>
        </div>
        
        <div class="input-group file-group">
          <input id="tds" type="file" name="tds" accept="application/pdf" hidden>

          <div class="file-box">
            <span class="file-text">Choose file</span>
            <span class="file-name">No file selected</span>
            <img id="tds-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
          </div>
          
          <label>Upload TDS file</label>
        </div>

        <input type="submit" class="registerbtn button" value="Create Item" />
      </div>
    </form>
  </section>
`;

let context = null;

export function createItemPage(ctx) {
  titleChange('Craete Item Page');
  context = ctx;
  
  ctx.render(itemTemplate());
  
  handleImputAndSelect();
  fileInput();
  pdfPreview('drawing');
  pdfPreview('tds');
  imagePreview();
  inputValidation();
}

async function onCreate(event) {
  const { data, form, formData } = onSubmit(event);
  const image = formData.get('image');
  const tds = formData.get('tds');
  const files = formData.getAll('itemDrawing');
  const user = getUser();
  
  try {
    if (data) {
      if (
        data.name == "" ||
        data.shape == "" ||
        data.type == "" ||
        data.cavityNumbers == "" ||
        data.volume == "" ||
        data.weight == ""
      ) {
        throw "All fields in red are required!";
      }

      if (!image || image.size === 0) {
        throw 'All fields in red are required!';
      }

      if (!tds || tds.size === 0) {
        throw 'All fields in red are required!';
      }

      let item = Object.assign({ _ownerId: user._id }, data);

      const uploadedFiles = await sendDrawing(formData);

      item.image = uploadedFiles.image;
      item.tds = uploadedFiles.tds;
      item.itemDrawing = uploadedFiles.itemDrawings;
      
      localStorage.setItem('item', JSON.stringify(item));
      
      context.page.redirect('/create-mold');
    }
    form.reset();
  } catch (error) {
    notifyNoEvent(error);
  }
}
