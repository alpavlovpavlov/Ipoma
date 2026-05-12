import { render } from '../../node_modules/lit-html/lit-html.js';

const main = document.querySelector('main');

export function onRenderContent(ctx, next) {
    ctx.render = renderView;

    next();
};

function renderView(content) {
    render(content, main);
};

