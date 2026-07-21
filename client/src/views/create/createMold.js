import { html } from 'https://unpkg.com/lit?module';

import { createMoldAndItem, sendDrawing } from "../../data/mold.js";
import { onSubmit } from "../../middlewears/submit.js";
import { getUser } from "../../util/util.js";
import { titleChange } from '../../util/title.js';
import { showHideHRSNInput, showHidePitchInput } from "../../util/swowHideinputElement.js";
import { pdfPreview, fileInput, handleImputAndSelect, inputValidation, inputSanitizer } from "../../util/changeElementState.js";
import { notifyNoEvent } from "../notify.js";

const moldTemplate = (item) => html`
  <section id="create-item">
    <form class="two-columns-form" id="create-form" enctype="multipart/form-data" @submit=${onCreate}>
      <div class="form-group">
        <h1>Mold data</h1>

        <div class="input-group active">
          <input class="input-create" type="text" placeholder="" .value=${item.name} name="name" disabled />
          <label>Item name</label>
        </div>

        <div class="input-group">
          <input class="input-create" type="number" placeholder="" name="date" min="1990" max="2099" />
          <label>Year of manufactoring</label>
        </div>

        <div class="input-group">
          <input class="input-create" type="text" placeholder="" name="producer" />
          <label>Mold manufacturer</label>
        </div>

        <div class="input-group">
          <input class="input-create" type="text" placeholder="" name="serialNumber" />
          <label>Mold serial number</label>
        </div>

        <div class="input-group select-group">
          <select id="hotRunnerMan" class="option-create" type="text" name="hotRunnerMan">
            <option value="" disabled selected>--Select--</option>
            <option>n.a.</option>
            <option>Maenner</option>
            <option>DME</option>
            <option>Mold Masters</option>
            <option>Husky</option>
          </select>
          <label>Hot-runner manufacturer</label>
        </div>

        <div class="input-group">
          <input id="hotRunnerSer" class="input-create" type="text" placeholder="" name="hotRunnerSer" />
          <label>Hot-runner serial number</label>
        </div>

        <div class="input-group">
          <input id="numberOfCavities" class="input-create mold-cav" type="text" placeholder="" name="numberOfCavities" />
          <label>Number of cavities</label>
        </div>

        <div class="input-group">
          <input id="pitchDistance" class="input-create" type="text" placeholder="" name="pitchDistance" />
          <label>Mold pitch distance, mm</label>
        </div>

        <div class="input-group select-group">
          <select class="option-create" type="text" name="wayOfInjection">
            <option value="" disabled selected>--Select--</option>
            <option>inside</option>
            <option>outside</option>
          </select>
          <label>Injection point</label>
        </div>

        <div class="input-group file-group not-required">
          <input id="drawing" type="file" name="moldDrawing" accept="application/pdf" multiple hidden />

          <div class="file-box">
            <span class="file-text">Choose files</span>
            <img id="drawing-preview" src="../../../images/pdf-icon.png" style="display:none; margin-top:10px; max-width:20px" type="application/pdf" />
            <span class="file-name">No file selected</span>
          </div>

          <label class="floating-label">Upload drawings</label>
        </div>

        <input type="submit" class="registerbtn button" value="Create Mold" />
      </div>
    </form>
  </section>
`;

let context = null;
let item = {};

export async function createMoldPage(ctx) {
  titleChange('Create Mold Page');
  context = ctx;
  
  item = JSON.parse(localStorage.getItem('item'));
  
  try {
    ctx.render(moldTemplate(item));
    
    showHidePitchInput();
    showHideHRSNInput();
    pdfPreview('drawing');
    fileInput();
    handleImputAndSelect();
    inputSanitizer();
    inputValidation();

    localStorage.removeItem('item');
  } catch (error) {
    return alert(error);
  }
}

async function onCreate(event) {
  const { data, form, formData } = onSubmit(event);
  const user = getUser();
  const files = formData.getAll('moldDrawing');
  const numberOfCav = data.numberOfCavities.split('+')[0];

  try {
    if (data) {
      if (
        data.producer == "" ||
        data.date == "" ||
        data.serialNumber == "" ||
        data.hotRunnerMan == "" ||
        data.numberOfCavities == "" ||
        data.wayOfInjection == "" ||
        data.dataUrl == ""
      ) {
        throw 'All fields in red are required!';
      }

      if (numberOfCav > 1 && data.pitchDistance == "") throw 'All fields in red are required!';

      let mold = Object.assign({ _itemId: item._id }, data);
      
      mold.name = item.name;
      mold["_ownerId"] = user._id;

      const uploadedFiles = await sendDrawing(formData);

      mold.moldDrawing = uploadedFiles.moldDrawings;
      
      const acceds = await createMoldAndItem({ item, mold });
      const itemType = (item.type).toLowerCase() + 's';
      const itemShape = item.shape;

      const choice = confirm('Would you like to create an item option now?');
      
      if(choice) {
        context.page.redirect(`/item-options/${acceds.createdItem._id}`);
      } else {
        context.page.redirect(`/${itemType}-catalog/${itemShape}`);
      }

      form.reset();
    }
  } catch (error) {
    notifyNoEvent(error);
  }
}
