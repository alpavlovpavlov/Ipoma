function normalize(path) {
    return path.replace(/\/$/, '');
};

export function setActiveNav(currentPath) {
    currentPath = normalize(currentPath);

    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));

    document.querySelectorAll('.nav a').forEach(link => {
        const href = link.getAttribute('href');

        if (!href || href === '#') {
            return;
        }

        const linkPath = normalize(new URL(link.href).pathname);

        if (linkPath === currentPath) {
            link.classList.add('active');

            const parentName = link.dataset.parent;

            if (parentName) {
                document
                .querySelectorAll(`[data-nav="${parentName}"]`)
                .forEach(parent =>parent.classList.add('active'));
            }
        }
    });
}