import {
    create,
    update,
    remove,
    fetch,
    uploadFile,
} from '../utils/apiUtils';
import { variables } from '../utils/Variables';

const API_BASE_URL = variables.API_URL;
const EMPLOYEE_ENDPOINT = `${API_BASE_URL}employee`;
const GENDER_ENDPOINT = `${EMPLOYEE_ENDPOINT}/gender-count`;

export const createEmployee = (data) => create(data, EMPLOYEE_ENDPOINT);
export const updateEmployee = (data) => update(data, EMPLOYEE_ENDPOINT);
export const deleteEmployee = (departmentId) => remove(departmentId, EMPLOYEE_ENDPOINT);
export const fetchEmployees = () => fetch(EMPLOYEE_ENDPOINT);
export const fetchGenderData = () => fetch(GENDER_ENDPOINT);
export const uploadEmployeeFile = (file) => {
    const UPLOAD_ENDPOINT = `${EMPLOYEE_ENDPOINT}/SaveFile`; // Reemplaza con la ruta correcta para cargar archivos de empleados
    return uploadFile(UPLOAD_ENDPOINT, file);
};