const div = document.getElementById('errorBox');
const span = div.querySelector('span');

export function notify(message, e) {
    span.textContent = message;

    if (e) {
        const rect = e.target.getBoundingClientRect();

        div.style.position = "fixed";
        div.style.left = (rect.right + 10) + "px";
        div.style.top = rect.top + "px";
    }

    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 3000);
};

export function notifyNoEvent(error) {
    span.textContent = error;

    div.style.display = 'block';
    setTimeout(() => div.style.display = 'none', 3000);
};