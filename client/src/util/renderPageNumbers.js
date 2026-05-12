let context = '';

export function renderPageNumbers(state, loadPage, ctx) {
    context = ctx;
    const container = document.getElementById("page-numbers");

    if (container != null) {
        const current = state.currentPage;
        const total = state.totalPages;
        const maxVisible = 4;

        let start = Math.max(1, current - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;

        if (end > total) {
            end = total;
            start = Math.max(1, end - maxVisible + 1);
        };

        if (start > 1) {
            container.appendChild(createPageButton(1, state, loadPage));
            if (start > 2) container.appendChild(createDots());
        };

        for (let i = start; i <= end; i++) {
            container.appendChild(createPageButton(i, state, loadPage));
        };

        if (end < total) {
            if (end < total - 1) container.appendChild(createDots());
            const lastBtn = createPageButton(total, state, loadPage);
            lastBtn.textContent = 'last';
            container.appendChild(lastBtn);
        };
    };
};

function createPageButton(page, state, loadPage) {
    const btn = document.createElement("button");

    btn.textContent = page;
    btn.classList.add("page-number");

    if (page === state.currentPage) {
        btn.classList.add("active");
    };

    btn.addEventListener("click", () => {
        state.currentPage = page;
        loadPage(context);
    });

    return btn;
};

function createDots() {
    const span = document.createElement("span");
    span.textContent = "...";
    span.classList.add("pagination-dots");
    return span;
};
