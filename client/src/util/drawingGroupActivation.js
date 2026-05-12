export function drawingGroup(acced) {
    Array.from(document.querySelectorAll('.file-group input')).forEach(input => {
        if (acced[input.name].length > 0) {
            const div = input.closest('.file-group');
            div.classList.add('active');
        }
    });
}