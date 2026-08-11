<button class="button" @click={showRelatedItems} id="related-toggle">Related items</button>

<div class="wrap-table" id="item-right-table" style="display: none;">
                        ${items.length > 0
                            ? html`
                                <table class="right-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Items</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        ${items.map(item => html`
                                            <tr>
                                                <td>
                                                    <img src="${item.image}" width="24">
                                                </td>

                                                <td class="clickable" @click=${() => itemDtls(item._id)}>${item.name}</td>
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                            `
                            : html`<h3 class="heading3">No items registered on this machine</h3>`
                        }
                    </div>

function showRelatedItems() {
    const button = document.getElementById('related-toggle');
    const div = document.getElementById('item-right-table');
    
    if(div.style.display == 'none') {
        div.style.display = 'table';
        button.textContent = 'Hide related items';
        // call new function here
    } else {
        div.style.display = 'none';
        button.textContent = 'Show related items';
    }
}