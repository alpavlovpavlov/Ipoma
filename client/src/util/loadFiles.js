import { getFiles } from "../data/item.js";

export async function loadPictures() {
  const select = document.getElementById('fileSelect');

  try {
    const files = await getFiles('/pictures');
    
    files.forEach(file => {
      const option = document.createElement('option');
      option.value = file.path;
      option.textContent = file.name;
      select.appendChild(option);
    });
  } catch (error) {
    return alert(error);
  }
};

export async function loadDrawings() {
  const select = document.getElementById('fileSelect');

  try {
    const files = await getFiles('/drawings');
    
    files.forEach(file => {
      const option = document.createElement('option');
      option.value = file.path;
      option.textContent = file.name;
      select.appendChild(option);
    });
  } catch (error) {
    return alert(error);
  };
};

export async function loadMachineTypes() {
  const select = document.getElementById('fileSelect');

  try {
    const files = await getFiles('/types');
    
    files.forEach(file => {
      const option = document.createElement('option');
      option.value = file.path;
      option.textContent = file.name;
      select.appendChild(option);
    });
  } catch (error) {
    return alert(error);
  }
};