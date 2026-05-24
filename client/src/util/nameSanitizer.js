export function nameSanitizer(formData, files, param) {
    formData.delete(param);

    let sanitizedFileName = null

    if (Array.isArray(files)) {
        files.forEach(file => {
            if (file.size == 0) return;

            const renamedFile = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
            sanitizedFileName = new File([file], renamedFile, { type: file.type });

            console.log(sanitizedFileName);
            formData.append(param, sanitizedFileName);
        })
    } else if (files instanceof File) {
        if (files.size === 0) return formData;

        const renamedFile = files.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        sanitizedFileName = new File([files], renamedFile, { type: files.type });
        
        console.log(sanitizedFileName);
        formData.set(param, sanitizedFileName);
    }

    return formData;
}