export function removeSpaces(input) {
    input.value = input.value.replace(/\s/g, '');
}

export function removeAllAddOneSpace(input) {
    input.value = input.value.replace(/\s/g, '');
    input.value = value.replace(/([A-Za-z]+)(\d+)/, '$1 $2');
}