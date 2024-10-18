import {
    create,
    update,
    remove,
    fetch,
} from '../utils/apiUtils';
import { variables } from '../utils/Variables';

const API_BASE_URL = variables.API_URL;
const DEPARTMENT_ENDPOINT = `${API_BASE_URL}department`;

export const createDepartment = (data) => create(data, DEPARTMENT_ENDPOINT);
export const updateDepartment = (data) => update(data, DEPARTMENT_ENDPOINT);
export const deleteDepartment = (departmentId) => remove(departmentId, DEPARTMENT_ENDPOINT);
export const fetchDepartments = () => fetch(DEPARTMENT_ENDPOINT);
