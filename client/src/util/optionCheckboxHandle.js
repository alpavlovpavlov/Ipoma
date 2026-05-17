export function showHideIMLOption(itemType) {
  const div = document.querySelector('.filter-dropdown');
  const checkboxes = Array.from(document.querySelectorAll('.category'));
  const others = [...checkboxes].filter(cb => cb.value !== "n.a.");
  const rest = Array.from(document.querySelectorAll("#categoryList label")).splice(-5);
  const naCheckbox = document.querySelector('.category[value="n.a."]');
  const divOther = document.querySelector('.filter-dropdown-op');

  const rules = {
    Handle: () => {
      naCheckbox.checked = true;
      others.forEach(cb => cb.checked = false);
      div.style.display = 'none';
    },

    Lid: () => {
      divOther.style.display = 'none';
      checkboxes.forEach(cb => cb.checked = false);
      rest.forEach(cb => cb.style.display = 'none');
    }
  }

  rules[itemType]?.();
}