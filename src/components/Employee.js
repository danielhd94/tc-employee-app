import React, { useState, useEffect, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDeleteConfirmation from '../hooks/useDeleteConfirmation';
import { ConfirmationDialog } from './ConfirmationDialog';
import Form from './Form';
import { fetchDepartments } from '../api/departmentApi.js';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/employeeApi.js';
import {
    Button,
    Box,
    Typography,
    Avatar,
    useMediaQuery,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import ResponsiveTable from './ResponsiveTable';
import { variables } from '../utils/Variables';

import loadable from '@loadable/component';

const CustomModal = loadable(() => import('./CustomModal'));

const Employee = () => {
    const ADD_EMPLOYEE_TEXT = 'Add Employee';
    const EDIT_EMPLOYEE_TEXT = 'Edit Employee';
    const CREATE_TEXT = 'Create';
    const UPDATE_TEXT = 'Update';

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [employee, setEmployee] = useState({
        employeeId: null,
        employeeCode: '',
        employeeName: '',
        department: "",
        dateOfJoining: '',
        photoFileName: 'anonymous.png',
        gender: "",
    });
    const [employees, setEmployees] = useState([]);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [shouldFetchDepartment, setShouldFetchDepartment] = useState(true);

    const fetchApiData = async (apiFunction, setData, storageKey, errorMessage) => {
        setIsLoadingData(true);
        try {
            const response = await apiFunction();
            if (response.success) {
                setData(response.data);
                localStorage.setItem(storageKey, JSON.stringify(response.data));
            } else {
                console.error(errorMessage);
            }
        } catch (error) {
            console.error(`An error occurred while fetching data: ${error}`);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (shouldFetch) {
            fetchApiData(fetchEmployees, setEmployees, 'employeeData', 'Failed to fetch employee data');
            setShouldFetch(false);
        }
        if (shouldFetchDepartment) {
            fetchApiData(fetchDepartments, setDepartments, 'departmentData', 'Failed to fetch department data');
            setShouldFetchDepartment(false);
        }
    }, [shouldFetch, shouldFetchDepartment]);


    const {
        showConfirmation,
        itemToDelete,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    } = useDeleteConfirmation();

    const [departments, setDepartments] = useState([]);

    const handleConfirmToDelete = async () => {
        const response = await handleConfirmDelete(deleteEmployee);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        const updatedEmployees = employees.filter(employee => employee.employeeId !== itemToDelete);
        setEmployees(updatedEmployees);

        localStorage.setItem('employeeData', JSON.stringify(updatedEmployees));
        toast.success(response.data);
    };

    const handleSubmit = async (data) => {
        try {
            const parameter = {
                ...data,
                department: {
                    departmentId: data.department,
                },
                gender: {
                    genderId: data.gender,
                }
            };
            const response = isEditMode
                ? await updateEmployee(parameter)
                : await createEmployee(parameter);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            if (isEditMode) {
                const updatedEmployees = employees.map(employee => {
                    if (employee.employeeId === data.employeeId) {
                        return { ...employee, ...response.data };
                    }
                    return employee;
                });

                setEmployees(updatedEmployees);
                localStorage.setItem('employeeData', JSON.stringify(updatedEmployees));
            } else {

                setEmployees([...employees, response.data]);
                localStorage.setItem('employeeData', JSON.stringify([...employees, response.data]));
            }
            toast.success(response.message);
            closeModal();
        } catch (error) {
            toast.error('An error occurred while processing the request.');
        }
    };

    const handleAddClick = () => {
        setEmployee({
            employeeId: null,
            employeeName: '',
            department: {},
            dateOfJoining: '',
            photoFileName: 'anonymous.png',
            gender: {},
        });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        const newItem = {
            ...item,
            dateOfJoining: formatDate(item.dateOfJoining),
            department: item.department?.value,
            gender: item.gender?.value
        };
        setEmployee(newItem);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const DEPARTMENT_OPTIONS = useMemo(() => {
        return departments.map(item => ({
            value: item.departmentId,
            label: item.departmentName
        }));
    }, [departments]);

    const GENDER_OPTIONS = useMemo(() => [
        { value: 1, label: 'Male' },
        { value: 2, label: 'Female' },
    ], []);

    const formatDate = (isoDate) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const [month, day, year] = new Date(isoDate).toLocaleDateString(undefined, options).split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };


    const createTextRenderCell = (field) => (params) => {
        const value = params.row[field];

        // Verificar si el valor es una fecha en formato ISO
        if (value && typeof value === 'string' && value.includes('T')) {
            const formattedDate = formatDate(value);
            return <Box sx={{ fontWeight: 'light' }}>{formattedDate}</Box>;
        }

        return <Box sx={{ fontWeight: 'light' }}>{value && value.label ? value.label : value}</Box>;
    };

    const createIconButtonRenderCell = (icon, onClick) => (params) => (
        <IconButton color="primary" size="small" onClick={() => onClick(params.row)}>
            {icon}
        </IconButton>
    );

    const renderGenderCell = createTextRenderCell('gender');
    const renderDepartmentCell = createTextRenderCell('department');
    const renderEditCell = createIconButtonRenderCell(<EditIcon />, (params) => handleEdit(params));
    const renderDeleteCell = createIconButtonRenderCell(<DeleteIcon />, (params) => handleDeleteClick(params.employeeId));

    const renderProfileCell = (params) => {
        const photoFileName = params.row.photoFileName; // Suponiendo que `photoFileName` sea el nombre del archivo de la foto
        const imageUrl = variables.PHOTO_URL + (photoFileName || 'anonymous.png'); // URL de la imagen de perfil

        return (
            <Avatar
                alt="photo profile"
                src={imageUrl} // Establece el origen de la imagen de perfil
                sx={{ width: '36px', height: '36px' }} // Estilo del avatar
            />
        );
    };
    const COLUMNS = useMemo(() => [
        { field: 'employeeCode', headerName: 'Employee Code', width: 150, renderCell: createTextRenderCell('employeeCode') },
        { field: 'gender', headerName: 'Gender', width: 120, renderCell: renderGenderCell },
        { field: 'photoFileName', headerName: 'Profile', width: 100, sortable: false, filterable: false, renderCell: renderProfileCell },
        { field: 'employeeName', headerName: 'Employee Name', width: 200, renderCell: createTextRenderCell('employeeName') },
        { field: 'department', headerName: 'Department', width: 150, renderCell: renderDepartmentCell },
        { field: 'dateOfJoining', headerName: 'Joining Date', width: 150, renderCell: createTextRenderCell('dateOfJoining') },
        { field: 'edit', headerName: 'Editar', width: 100, sortable: false, filterable: false, renderCell: renderEditCell },
        { field: 'delete', headerName: 'Eliminar', width: 110, sortable: false, filterable: false, renderCell: renderDeleteCell },
    ], []);


    const FIELDS = useMemo(() => [
        { label: 'Employee Name', name: 'employeeName', type: 'text' },
        { label: 'Department', name: 'department', type: 'select', options: DEPARTMENT_OPTIONS },
        { label: 'Gender', name: 'gender', type: 'select', options: GENDER_OPTIONS },
        { label: 'Date of Joining', name: 'dateOfJoining', type: 'date' },
        { label: 'Profile', name: 'photoFileName', type: 'file' },
    ], [DEPARTMENT_OPTIONS, GENDER_OPTIONS]);

    const MOVIL_COLUMNS = useMemo(() => FIELDS.map((field) => ({
        field: field.name,
        label: field.label,
        type: field.name === 'photoFileName' ? 'img' : 'text',
    })), [FIELDS]);

    const newData = employees.map(({ department, gender, ...rest }) => ({
        ...rest,
        department: {
            value: department.departmentId,
            label: department.departmentName,
        },
        gender: {
            value: gender.genderId,
            label: gender.genderName,
        }
    }));

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Box sx={{ p: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant={isSmallScreen ? 'h5' : 'h4'} marginBottom={2}>
                        Employee Page
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                        startIcon={<AddIcon />}
                        sx={{
                            fontSize: isSmallScreen ? '0.8rem' : '1rem',
                            padding: isSmallScreen ? '6px 12px' : '8px 16px',
                        }}
                    >
                        Agregar
                    </Button>
                </Grid>
            </Grid>

            <Box mt={3}>
                <ResponsiveTable
                    data={newData}
                    columns={COLUMNS}
                    movilColumns={MOVIL_COLUMNS}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    getId={(item) => item.employeeId}
                    isLoading={isLoadingData}
                />
            </Box>

            <React.Suspense fallback={<h1>Cargando...</h1>}>
                <CustomModal
                    open={isModalOpen}
                    onClose={closeModal}
                    title={isEditMode ? EDIT_EMPLOYEE_TEXT : ADD_EMPLOYEE_TEXT}
                    content={
                        <Form
                            fields={FIELDS}
                            onSubmit={handleSubmit}
                            submitValue={isEditMode ? UPDATE_TEXT : CREATE_TEXT}
                            defaultValues={isEditMode ? employee : {}}
                        />
                    }
                    sx={{
                        width: isSmallScreen ? '90%' : '50%',
                        margin: 'auto',
                    }}
                />
            </React.Suspense>

            <ConfirmationDialog
                isOpen={showConfirmation}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmToDelete}
                sx={{
                    width: isSmallScreen ? '90%' : '400px',
                    padding: isSmallScreen ? '16px' : '24px',
                }}
            />

            <ToastContainer />
        </Box>
    );
}

export default Employee;
