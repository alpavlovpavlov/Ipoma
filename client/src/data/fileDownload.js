import { get } from '../data/api.js';

export async function downloadDrawing(acced, filename, tds) {
    let responce = '';
    try {
        // if (tds == true) {
        //     responce = await get(`/download/${acced}/tds/${filename}`, undefined, true);
        // } else if (tds == false) {
        //     responce = await get(`/download/${acced}/${filename}`, undefined, true);
        // };

        tds == false ?
            responce = await get(`/download/${acced}/${filename}`, undefined, true) :
            responce = await get(`/download/${acced}/tds/${filename}`, undefined, true);
    
        if (!responce.ok) {
            throw new Error("Download failed");
        };
    
        const blob = await responce.blob();
        const url = window.URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
    
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        return alert(error);
    };
};