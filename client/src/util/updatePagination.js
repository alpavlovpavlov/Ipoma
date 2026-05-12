export function updatePaginationUI(prev, next, state, currentPage, context) {
    const prevBtn = document.getElementById(prev);
    const nextBtn = document.getElementById(next);
   
    if (prevBtn != null) {
        prevBtn.disabled = state.currentPage === 1;
    };

    if (nextBtn != null) {
        nextBtn.disabled = state.currentPage === state.totalPages;
    };
    
    pagination(state, prevBtn, nextBtn, currentPage, context);
};

export function pagination(state, prevBtn, nextBtn, page, context) {
    if (prevBtn != null) {
        prevBtn.addEventListener("click", () => {
            if (state.currentPage > 1) {
                state.currentPage--;
                page(context);
            };
        });
    };

    if (nextBtn != null) {
        nextBtn.addEventListener("click", () => {
            if (state.currentPage < state.totalPages) {
                state.currentPage++;
                page(context);
            };
        });
    };
};