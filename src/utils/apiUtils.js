import axios from 'axios';

function performApiCall(apiFunction) {
    return apiFunction()
        .then((result) => result)
        .catch((err) => {
            const { data } = err.response;
            return data;
        });
}

function performRequest(method, url, data) {
    return performApiCall(async () => {
        const axiosConfig = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data ? JSON.stringify(data) : null,
        };

        const response = await axios(axiosConfig);
        return response.data;
    });
}

export async function create(data, endpoint) {
    return performRequest('POST', endpoint, data);
}

export async function update(data, endpoint) {
    return performRequest('PUT', `${endpoint}`, data);
}

export async function remove(departmentId, endpoint) {
    return performRequest('DELETE', `${endpoint}/${departmentId}`);
}

export async function fetch(endpoint) {
    return performRequest('GET', endpoint);
}

export async function uploadFile(endpoint, file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const axiosConfig = {
            method: 'POST',
            url: endpoint,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        };

        const result = await axios(axiosConfig);
        return result.data;
    } catch (error) {
        return { success: false,data: null, message: 'Error al cargar el archivo' };
    }
}
