export function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    //const data = Object.fromEntries([...formData.entries()]);//.map(([k, v]) => [k, v.trim()]));

    const data = {};

    for (const key of formData.keys()) {
        const values = formData.getAll(key);
        data[key] = values.length > 1 ? values : values[0];
    };

    return { data, form, formData };
};