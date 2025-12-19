/**
 * Servicio centralizado para manejar peticiones a la API.
 * Normaliza la URL base de las variables de entorno para evitar errores de dobles barras
 * o falta de prefijos en producción.
 */

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    // Limpiar barras finales para evitar // en la concatenación
    url = url.replace(/\/+$/, '');

    return url;
};

const API_BASE_URL = getBaseUrl();

export const apiFetch = async (endpoint, options = {}) => {
    // Asegurar que el endpoint empiece con /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error en la petición: ${response.status}`);
    }

    return response.json();
};

export default {
    get: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, data, options) => apiFetch(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
    }),
    put: (endpoint, data, options) => apiFetch(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
};
