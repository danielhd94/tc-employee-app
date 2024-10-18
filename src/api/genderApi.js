import {
    create,
    update,
    remove,
    fetch,
    uploadFile,
} from '../utils/apiUtils';
import { variables } from '../utils/Variables';

const API_BASE_URL = variables.API_URL;
const GENDER_ENDPOINT = `${API_BASE_URL}gender`;
const GENDER_COUNT_ENDPOINT = `${GENDER_ENDPOINT}/count`;

export const createGender = (data) => create(data, GENDER_ENDPOINT);
export const updateGender = (data) => update(data, GENDER_ENDPOINT);
export const deleteGender = (genderId) => remove(genderId, GENDER_ENDPOINT);
export const fetchGenders = () => fetch(GENDER_ENDPOINT);
export const fetchGenderCount = () => fetch(GENDER_COUNT_ENDPOINT);
