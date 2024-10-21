import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchData } from '../hooks/useFetchData';
import { useEmployeeForm } from '../hooks/useEmployeeForm';
import useDeleteConfirmation from '../hooks/useDeleteConfirmation';
import { fetchEmployees, deleteEmployee } from '../api/employeeApi';
import { fetchDepartments } from '../api/departmentApi';
import {
    Button,
    Box,
    Typography,
    Grid,
    IconButton,
    Avatar,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ResponsiveTable from './ResponsiveTable';
import CustomModal from './CustomModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import Form from './Form';
import { variables } from '../utils/Variables';
import { useTheme } from '@mui/material/styles';

const Employee = () => {
    const theme = useTheme();
    // Fetch employees and departments using custom hooks
    const { data: employees = [], isLoadingData, setData: setEmployees } = useFetchData(fetchEmployees, 'employeeData');
    const { data: departments } = useFetchData(fetchDepartments, 'departmentData');

    // Modal and form state handling
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { employee, setEmployee, handleSubmit, isSubmitting } = useEmployeeForm(employees, setEmployees, isEditMode);

    // Delete confirmation handling
    const {
        showConfirmation,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    } = useDeleteConfirmation(employees, setEmployees);

    // Define department and gender options
    const DEPARTMENT_OPTIONS = departments.map(dept => ({ label: dept.departmentName, value: dept.departmentId }));
    const GENDER_OPTIONS = useMemo(() => [
        { label: 'Male', value: 1 },
        { label: 'Female', value: 2 },
        { label: 'Other', value: 3 }
    ], []);

    // Define fields for the form
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

    const closeModal = () => {
        setIsModalOpen(false);
        setEmployee({}); // Reiniciar el empleado al cerrar el modal
    };


    const handleAddClick = () => {
        setEmployee({
            employeeId: null,
            employeeCode: '', // Añadir un campo para el código del empleado si es necesario
            employeeName: '',
            department: {
                departmentId: null, // Inicializa el departmentId como null
                departmentName: '' // Inicializa el departmentName como un string vacío
            },
            dateOfJoining: '',
            photoFileName: 'anonymous.png',
            gender: {
                genderId: null, // Inicializa el genderId como null
                genderName: '' // Inicializa el genderName como un string vacío
            },
            rate: 0, // Inicializa la tasa
            overtimeRate: 0 // Inicializa la tasa de horas extra
        });
        setIsEditMode(false); // Establece el modo de edición a falso
        setIsModalOpen(true); // Abre el modal
    };


    // Define handleEdit with useCallback
    /*const handleEdit = useCallback((item) => {
        setEmployee(item);
        setIsEditMode(true);
        setIsModalOpen(true);
    }, [setEmployee, setIsEditMode]);*/
    const formatDate = (isoDate) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const [month, day, year] = new Date(isoDate).toLocaleDateString(undefined, options).split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const handleEdit = useCallback((item) => {
        const newItem = {
            ...item,
            dateOfJoining: formatDate(item.dateOfJoining),
            department: item.department?.value,
            gender: item.gender?.value
        };
        setEmployee(newItem);
        setIsEditMode(true);
        setIsModalOpen(true);
    }, [setEmployee, setIsEditMode]);

    // Table columns definition
    const COLUMNS = useMemo(() => [
        {
            field: 'photoFileName', headerName: 'Profile', width: 100,
            renderCell: params => <Avatar
                key={`img_${params.row.photoFileName || '/anonymous.png'}`}
                src={variables.PHOTO_URL + (params.row.photoFileName || 'anonymous.png')}
                sx={{ width: '2.5rem', height: '2.5rem' }}
            />
        },
        { field: 'employeeCode', headerName: 'Code', width: 150 },
        { field: 'employeeName', headerName: 'Name', width: 200 },
        {
            field: 'department', headerName: 'Department', width: 150,
            renderCell: params => <Box>{params.row.department.departmentName}</Box>
        },
        {
            field: 'dateOfJoining', headerName: 'Joining Date', width: 150,
            renderCell: params => new Date(params.row.dateOfJoining).toLocaleDateString()
        },
        {
            field: 'edit', headerName: 'Edit', width: 100,
            renderCell: params => (
                <IconButton onClick={() => handleEdit(params.row)} aria-label="Edit employee">
                    <EditIcon />
                </IconButton>
            )
        },
        {
            field: 'delete', headerName: 'Delete', width: 100,
            renderCell: params => (
                <IconButton onClick={() => handleDeleteClick(params.row.employeeId)} aria-label="Delete employee">
                    <DeleteIcon />
                </IconButton>
            )
        },
    ], [handleDeleteClick, handleEdit]);

    useEffect(() => {
        if (!isSubmitting) {
            closeModal();
        }
    }, [isSubmitting]);

    return (
        <Grid container justifyContent="center" sx={{ padding: '1rem' }}>
            <Grid item xs={12} lg={10}>
                <ToastContainer />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        marginBottom: '1.5rem',
                        bgcolor: theme.palette.background.default,
                        padding: '1rem',
                        borderRadius: '8px',
                        boxShadow: 2
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                        Employees
                    </Typography>
                    <Button
                        onClick={handleAddClick}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{ padding: '0.6rem 1.2rem', textTransform: 'none', borderRadius: '8px' }}
                    >
                        Add Employee
                    </Button>
                </Box>
                {isLoadingData ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ height: '250px' }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <ResponsiveTable
                        data={employees}
                        columns={COLUMNS}
                        isLoading={isLoadingData}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        getId={item => item.employeeId}
                    />
                )}

                {/* Modal for Add/Edit Employee */}
                <React.Suspense fallback={<h1>Cargando...</h1>}>
                    <CustomModal
                        open={isModalOpen}
                        onClose={closeModal}
                        title={isEditMode ? 'Edit Employee' : 'Add Employee'}
                        content={
                            <Form
                                fields={FIELDS}
                                onSubmit={handleSubmit}
                                submitValue={isEditMode ? 'Update Employee' : 'Create Employee'}
                                defaultValues={isEditMode ? employee : {}}
                            />
                        }
                        sx={{
                            width: { xs: '95%', sm: '80%', md: '70%' }, // Ajuste responsive
                            margin: 'auto',
                        }}
                    />
                </React.Suspense>

                {/* Confirmation Dialog for Delete */}
                <ConfirmationDialog
                    isOpen={showConfirmation}
                    onCancel={handleCancelDelete}
                    onConfirm={() => handleConfirmDelete(deleteEmployee)}
                />
            </Grid>
        </Grid>
    );

};

export default Employee;
