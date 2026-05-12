export function handleChange() {
    const checkboxes = document.querySelectorAll(".category");
    checkboxes.forEach(cb => {cb.addEventListener("change", () => handleChange(checkboxes));});
    const naCheckbox = document.querySelector('.category[value="n.a."]');
    const others = [...checkboxes].filter(cb => cb.value !== "n.a.");

    if (naCheckbox.checked) {
        // ако n.a. е избрано → disable всички други
        others.forEach(cb => {
            cb.checked = false;
            cb.disabled = true;
        });
    } else {
        // ако n.a. не е избрано → enable всички
        others.forEach(cb => cb.disabled = false);
    };

    // ако някой друг е избран → disable n.a.
    const anyOtherChecked = others.some(cb => cb.checked);

    if (anyOtherChecked) {
        naCheckbox.checked = false;
        naCheckbox.disabled = true;
    } else {
        naCheckbox.disabled = false;
    };
};