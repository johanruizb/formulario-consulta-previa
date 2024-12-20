function blobToArrayBuffer(blob) {
    if (!(blob instanceof Blob)) return;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

function formDataFromObject(obj) {
    const formData = new FormData();
    for (const key in obj) {
        if (Array.isArray(obj[key]))
            formData.append(key, JSON.stringify(obj[key]));
        else formData.append(key, obj[key]);
    }
    return formData;
}

export { formDataFromObject, blobToArrayBuffer };
