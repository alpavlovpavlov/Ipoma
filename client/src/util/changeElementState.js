export function newInput(file) {
  const fileInput = document.getElementById(file);
  const fileGroup = document.querySelector(".file-group");
  const fileName = document.querySelector(".file-name");

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        fileGroup.classList.add("active");
        fileName.textContent = fileInput.files[0].name;
    } else {
      fileGroup.classList.remove("active");
      fileName.textContent = "No file selected";
    }
  });
}

export function universal() {
  document.querySelectorAll('.input-group input').forEach(input => {
    const group = input.closest('.input-group');

    input.addEventListener('change', () => {
      if (input.value != '') {
        group.classList.add('active');
      } else {
        group.classList.remove('active');
      }
    });
  });
};

export function universalSelect() {
  document.querySelectorAll('.select-group select').forEach(select => {
    const group = select.closest('.select-group');

    select.addEventListener('change', () => {
      if (select.textContent != '--Select--') {
        group.classList.add('active');
      } else {
        group.classList.remove('active');
      }
    });
  });
};

export function handleImputAndSelect() {
  document.querySelectorAll('.input-group input, .input-group select').forEach(el => {
    const group = el.closest('.input-group');

    const toggle = () => {
      if (el.value && el.value.trim() !== '') {
        group.classList.add('active');
      } else {
        group.classList.remove('active');
      }
    };

    el.addEventListener('input', toggle);   // 🔥 за input
    el.addEventListener('change', toggle);  // 🔥 за select

    //toggle(); // initial state (edit page!)
  });
}

export function fileInput() {
  document.querySelectorAll('.file-group input[type="file"]').forEach(input => {
    const group = input.closest('.file-group');
    const label = group.querySelector('.file-name');

    group.querySelector('.file-box').addEventListener('click', () => {
      input.click();
    });

    input.addEventListener('change', () => {
      const file = Array.from(input.files);
      const container = [];

      file.forEach(element => {
        container.push(element.name);
      });

      if (input.files.length > 0) {
        group.classList.add('active');
        label.textContent = container.join(', ');
      } else {
        group.classList.remove('active');
        label.textContent = "No file selected";
      }
    });
  });
};

export function imagePreview() {
  const imageInput = document.getElementById("image");
  const preview = document.getElementById("image-preview");

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      preview.src = url;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  });
}

export function pdfPreview(elementId) {
  const input = document.getElementById(elementId);
  const preview = document.getElementById(`${elementId}-preview`);

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (file) {
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  });
}

export function inputValidation() {
  const form = document.getElementById("create-form");

  form.addEventListener("submit", (e) => {
    let isValid = true;

    document.querySelectorAll(".input-group").forEach(group => {
      if (!group.classList.contains('not-required')) {
        const input = group.querySelector("input, select");

        group.classList.remove("error");

        if (!group.classList.contains('active')) {
          group.classList.add("error");
          isValid = false;
        }
      }
    });

    if (!isValid) {
      e.preventDefault();
    }
  });
}

export function editForm() {
  document.querySelectorAll('.input-group input, .input-group select').forEach(el => {
    const group = el.closest('.input-group');
    if (el.tagName == 'INPUT') {
      if (el.value != '') group.classList.add('active');
    } else if (el.tagName == 'SELECT') {
      if (el.textContent != '') group.classList.add('active');
    }
  });
}

export function inputSanitizer() {
  Array.from(document.querySelectorAll('.input-create')).forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('name')) {
        input.value = input.value.replace(/\s/g, '');
        input.value = value.replace(/([A-Za-z]+)(\d+)/, '$1 $2');
        console.log(input.value);
      } else {
        input.value = input.value.replace(/\s/g, '');
        console.log(input.value);
      }
    })
  })
}