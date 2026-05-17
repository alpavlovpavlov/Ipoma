import { html } from 'https://unpkg.com/lit?module';

import { getItem } from "../../data/item.js";
import { getUser } from "../../util/util.js";
import { getAllForOptions, getById } from "../../data/imm.js";
import { titleChange } from '../../util/title.js';
import { createAnOption, deleteOption } from "../../data/option.js";
import { onSubmit } from "../../middlewears/submit.js";
import { viewCheckbox } from "../../util/viewCheckbox.js";
import { handleChange } from "../../util/handleChange.js";
import { showHideIMLOption } from "../../util/optionCheckboxHandle.js";
import { notifyNoEvent } from "../notify.js";
import { roleAssignment } from "../../util/role.js";

const optionTemplate = (item, options, isLoading, imms, role) => html`
  <section id="create-option">
    ${isLoading
      ? html`<h3>Loading &hellip;</h3>`
      : html`
        <div class="top">
          <div class="middle">
            <h1>Item ${item.name}</h1>
          </div>
          <table class="options-table" id="table-for-options">
            <thead>
                <tr>
                  <th rowspan="2">Option number</th>
                  <th colspan="7">IML</th>
                  <th colspan="2">Handle</th>
                  <th colspan="2">TE</th>
                  <th rowspan="2">Bottom holes</th>
                  <th rowspan="2">Logo insert</th>
                  <th rowspan="2">Sealing</th>
                  <th rowspan="2">Printing</th>
                  ${role == 'ipoma-user' || role == 'admin'
                    ? html`
                      <th rowspan="2">IMM</th>
                      <th rowspan="2">Action</th>
                    `
                    : ''
                  }
                </tr>

                <tr>
                  <th>n.a.</th>
                  <th>1 side</th>
                  <th>3 sides</th>
                  <th>5 sides</th>
                  <th>Wrap-around</th>
                  <th>Wrap-around & bottom</th>
                  <th>Bottom</th>

                  <th>Plastic</th>
                  <th>Metal</th>

                  <th>With TE</th>
                  <th>Without TE</th>
                </tr>
            </thead>

            ${options.length > 0
              ? html`
                <tbody>
                  ${options.map((option, i) => tbodyTemplate(option, i, role))}
                </tbody>
              `
              : html`<tbody></tbody>`
            }
          </table>
          <div class="middle">
            <a class="button" href="/item-details/${item._id}">< Back</a>
            ${role == 'ipoma-user' || role == 'admin'
              ? html`<button class="button" id="toggle-options" @click=${toggle}>Add an option</button>`
              : null
            }
          </div>
        </div>

        <form class="form-option" enctype="multipart/form-formData" @submit=${onCreate} style="dysplay:none">
          <div class="form-group" id="option-div" style="display: none;">
            <div class="filter-dropdown">
              <label class="file-label" for="categoryBtn">Select IML</label>
              <button type="button" class="input-create" id="categoryBtn" @click=${(e) => viewCheckbox(e, 'create-option', 'categoryList', '.filter-dropdown')} style="display: none">Select IML</button>
              <div class="checkbox-list" id="categoryList">
                <label><input class="category" type="checkbox" name="categories" value="n.a.">n.a.</label>
                <label><input class="category" type="checkbox" name="categories" value="1 side">1 Side</label>
                <label><input class="category" type="checkbox" name="categories" value="3 sides">3 Sides</label>
                <label><input class="category" type="checkbox" name="categories" value="5 sides">5 Sides</label>
                <label><input class="category" type="checkbox" name="categories" value="wrap-around">Wrap-around</label>
                <label><input class="category" type="checkbox" name="categories" value="wrap-around & bottom">Wrap-around & bottom</label>
                <label><input class="category" type="checkbox" name="categories" value="bottom">Bottom</label>
              </div>
            </div>

            <div class="filter-dropdown-op">
              <label class="file-label" for="categoryBtnOp">Select Options</label>
              <button type="button" class="input-create" id="categoryBtnOp" @click=${(e) => viewCheckbox(e, 'create-option', 'categoryListOp', '.filter-dropdown-op')} style="display: none;">Select IML</button>
              <div class="checkbox-list" id="categoryListOp">
                <label><input class="option-category" type="checkbox" name="categories" value="metal handle">Metal handle</label>
                <label><input class="option-category" type="checkbox" name="categories" value="plastic handle">Plastic handle</label>
                <label><input class="option-category" type="checkbox" name="categories" value="with te">With TE</label>
                <label><input class="option-category" type="checkbox" name="categories" value="no te">Without TE</label>
                <label><input class="option-category" type="checkbox" name="categories" value="bottom holes">Bottom holes</label>
                <label><input class="option-category" type="checkbox" name="categories" value="logo insert">Logo insert</label>
                <label><input class="option-category" type="checkbox" name="categories" value="sealing">Sealing</label>
                <label><input class="option-category" type="checkbox" name="categories" value="printing">Printing</label>
              </div>
            </div>

            <select class="select" id="imm" type="text" placeholder="Item shape" name="imm">
              <option value="" disabled selected>--Choose IMM--</option>
              ${imms.map(immTemplate)}
            </select>

            <input type="submit" class="registerbtn button" value="Create option" />
          </div>
        </form>
      `
    }
    
  </section>
`;

const tbodyTemplate = (option, i, role) => html`
  <tr>
    <td>
      <span class="check">${i + 1}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("n.a.") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("1 side") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("3 sides") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("5 sides") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("wrap-around") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("wrap-around & bottom") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("bottom") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("plastic handle") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("metal handle") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("with te") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("no te") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("bottom holes") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("logo insert") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("sealing") ? "✔" : ""}</span>
    </td>

    <td>
      <span class="check">${option.categories?.includes("printing") ? "✔" : ""}</span>
    </td>

    ${role == 'ipoma-user' || role == 'admin'
      ? html`
        <td >
          <p class="clickable" data-immid=${option.imm}>${option.immName}</p>
        </td>

        <td>
          <button class="delete-btn danger" data-optionid=${option._id} data-itemid=${option.item} data-immid=${option.imm} @click=${onDelete}>Delete</button>
        </td>
      `
      : ''
    }
  </tr>
`;

const immTemplate = (imm) => html`
  <option class="machine-id" value=${imm._id}>${imm.producer} ${imm.label}</option>
`;

let context = null;
let item = {};

export async function optionPage(ctx) {
  titleChange('Option Page');
  context = ctx;
  const itemId = ctx.params.itemId;
  const user = getUser();
  
  try {
    ctx.render(optionTemplate(item, [], true));
    
    item = await getItem(itemId);

    const options = item.options;
    const imms = await getAllForOptions();
    const currentUser = roleAssignment(user, item);

    if (options != undefined) {
      ctx.render(optionTemplate(item, options, false, imms, currentUser.role));
    } else {
      ctx.render(optionTemplate(item, [], false, imms, currentUser.role));
    }

    handleChange();
    showHideIMLOption(item.type);
    reviewIMM();
  } catch (error) {
    notifyNoEvent(error);
  }
}

function toggle() {
  const button = document.getElementById('toggle-options');
  const div = document.getElementById('option-div');

  if(div.style.display == 'none') {
    div.style.display = 'block';
    button.textContent = 'Hide option menu';
  } else {
    div.style.display = 'none';
    button.textContent = 'Add an option';
  }
}

async function onCreate(event) {
  const { data, form } = onSubmit(event);
  
  data.item = item._id;
  
  if (data.categories.length == 0) return alert('Please choose at least one option');
  if (data.imm == undefined) return alert('Please choose an injection machine');
  
  const imm = await getById(data.imm);
  const immName = imm.producer + ' ' + imm.label;
  
  data.immName = immName;
  
  if (data) {
    try {
      await createAnOption(item._id, data);

      optionPage(context);
    } catch (error) {
      notifyNoEvent(error);
    };
  };
  form.reset();
}

async function onDelete() {
  const choice = confirm('Are you sure you want to delete this option?');

  if (!choice) return;
  const table = document.getElementById('table-for-options');
  
  table.addEventListener('click', (e) => {
    if (e.target.tagName == 'BUTTON') {
      const optionId = e.target.dataset.optionid;
      const itemId = e.target.dataset.itemid;
      const immId = e.target.dataset.immid;
      
      try {
        deleteOption(optionId, { itemId, immId });
      } catch (error) {
        notifyNoEvent(error);
      }
    }
  })
}

function reviewIMM() {
  const table = document.getElementById('table-for-options');

  table.addEventListener('click', async (e) => {
    const p = e.target.closest(".clickable");

    if (!p) return;
    
    context.page.redirect(`/imm-details/${p.dataset.immid}`);
  })
}
