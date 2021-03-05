export default async function APIUploader(file,topic,key,format,titles,headers,general) {
    if (general) {
        let formData = new FormData;
        formData.append("dataFile", file);
        formData.append("name", topic);
        formData.append("key", key);
        formData.append("format", format);
        let response = await fetch('/softsort/generaldata', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData,
        });
    } else {
        let formData = new FormData;
        formData.append("dataFile", file);
        formData.append("name", topic);
        formData.append("key", key);
        formData.append("titles", titles);
        formData.append("headers", headers)
        formData.append("format", format);
        let response = await fetch('/softsort/autoschema', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData,
        });
        return ("Uploaded");
    }
}