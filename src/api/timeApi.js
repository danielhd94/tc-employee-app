import {
    create,
    update,
    remove,
    fetch,
} from '../utils/apiUtils';
import { variables } from '../utils/Variables';

const API_BASE_URL = variables.API_URL;
const TIME_ENDPOINT = `${API_BASE_URL}EmployeeTime`;

export const createTime = (data) => create(data, TIME_ENDPOINT);
export const updateTime = (data) => update(data, TIME_ENDPOINT);
export const deleteTime = (genderId) => remove(genderId, TIME_ENDPOINT);
export const fetchTimes = () => fetch(TIME_ENDPOINT);
