export function showHideIML(edit) {
  const div = document.querySelector('.filter-dropdown');
  const rest = Array.from(document.querySelectorAll("#categoryList label")).splice(-5);
  const checkboxes = Array.from(document.querySelectorAll('.category'));
  const others = [...checkboxes].filter(cb => cb.value !== "n.a.");
  const naCheckbox = document.querySelector('.category[value="n.a."]');
  const type = document.getElementById('type1');
  
  const chebxStatus = {
    "n.a": false,
    "1 side": false, 
    "3 sides": false, 
    "5 sides": false, 
    "wrap-around": false, 
    "wrap-around & bottom": false,
    "bottom": false, 
  };
  
  if (edit == true) {
    checkboxes.forEach(cb => {
      if (cb.checked == true) chebxStatus[cb.value] = true;
    });
    handleCheckboxes(type.textContent);
  };

  document.getElementById('type').addEventListener('input', (e) => handleCheckboxes(e.target.value));

  function handleCheckboxes(element) {
    if (element == 'Handle') {
      naCheckbox.checked = true;
      others.forEach(cb => cb.checked = false);
      div.style.display = 'none';
    } else {
      naCheckbox.checked = false;
      div.style.display = 'block';
    };

    if (element == 'Lid') {
      checkboxes.forEach(cb => cb.checked = false);
      rest.forEach(cb => cb.style.display = 'none');
      naCheckbox.disabled = false;
    } else {
      rest.forEach(cb => {
        cb.removeAttribute('style');
      });
    };

    if (edit == true) {
      checkboxes.forEach(cb => cb.checked = false);
      checkboxes.forEach(cb => {
        if (chebxStatus[cb.value] == true) cb.checked = true;
      });
    };
  };
};