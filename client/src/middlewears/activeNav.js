function normalize(path) {
    return path.replace(/\/$/, '');
};

// let currentPath2 = '';


// export function setActiveNav(currentPath) {
//     currentPath = normalize(currentPath);
//     currentPath2 = currentPath;

//     document.querySelectorAll('.nav a').forEach(a => {
//         a.classList.remove('active')
//     });

//     document.querySelectorAll('.nav a').forEach(link => {
//         const href = link.getAttribute('href');

//         if (!href || href === '#') {
//             return;
//         };

//         const linkPath = normalize(new URL(link.href).pathname);

//         if (linkPath === currentPath) {
//             const dropdown = link.closest('.create-dropdown');
            
//             if (!dropdown) {
//                 link.classList.add('active');
//             }
            
//             if (dropdown) {
//                 const parent = dropdown.querySelector(':scope > a');
//                 parent?.classList.add('active');
//             };
//         }
//     });
// }

// document.querySelectorAll('.create-dropdown').forEach(dropdown => {
//     const parentLink = dropdown.firstElementChild;
//     const childLinks = dropdown.querySelectorAll('.dropdown-menu a');

//     const hasActiveChild = [...childLinks].some(link => {
//         const linkPath = normalize(new URL(link.href).pathname);
        
//         return linkPath === currentPath2;
//     });

//     parentLink?.classList.toggle('active', hasActiveChild);
// });

export function setActiveNav(currentPath) {

    currentPath = normalize(currentPath);

    document.querySelectorAll('.nav a')
        .forEach(a => a.classList.remove('active'));

    document.querySelectorAll('.nav a').forEach(link => {

        const href = link.getAttribute('href');

        if (!href || href === '#') {
            return;
        }

        const linkPath =
            normalize(new URL(link.href).pathname);

        if (linkPath === currentPath) {

            link.classList.add('active');

            const parentName =
                link.dataset.parent;

            if (parentName) {

                document
                    .querySelectorAll(
                        `[data-nav="${parentName}"]`
                    )
                    .forEach(parent =>
                        parent.classList.add('active')
                    );
            }
        }
    });
}