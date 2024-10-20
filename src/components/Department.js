import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDeleteConfirmation from '../hooks/useDeleteConfirmation';
import { ConfirmationDialog } from './ConfirmationDialog';
import CustomModal from './CustomModal';
import Form from './Form';
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from '../api/departmentApi.js';
import {
    Button,
    Box,
    Typography,
    IconButton,
    Grid,
    useMediaQuery,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import ResponsiveTable from './ResponsiveTable';

const Department = () => {
    const ADD_DEPARTMENT_TEXT = 'Add Department';
    const EDIT_DEPARTMENT_TEXT = 'Edit Department';
    const CREATE_TEXT = 'Create';
    const UPDATE_TEXT = 'Update';
    const COLUMNS = [
        {
            field: 'departmentName',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'edit',
            headerName: 'Editar',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(params.row)}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            field: 'delete',
            headerName: 'Eliminar',
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(params.row.departmentId)}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const FIELDS = [
        { label: 'Name', name: 'departmentName', type: 'text' },
    ];

    const MOVIL_COLUMNS = FIELDS.map((field) => ({
        field: field.name,
        label: field.label,
        type: field.type ?? 'text',
    }));

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [shouldFetchDepartment, setShouldFetchDepartment] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [department, setDepartment] = useState({
        departmentId: null,
        departmentName: '',
    });

    const fetchDepartmentData = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetchDepartments();
            if (response.success) {
                setDepartments(response.data);
                localStorage.setItem('departments', JSON.stringify(response.data));
            } else {
                console.error('Failed to fetch department data');
            }
        } catch (error) {
            console.error('An error occurred while fetching department data:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (shouldFetchDepartment) {
            fetchDepartmentData();
            setShouldFetchDepartment(false);
        }
    }, [shouldFetchDepartment]);

    const {
        showConfirmation,
        itemToDelete,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    } = useDeleteConfirmation();

    const handleConfirmToDelete = async () => {
        const result = await handleConfirmDelete(deleteDepartment);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        const updatedDepartments = departments.filter(department => department.departmentId !== itemToDelete);
        setDepartments(updatedDepartments);

        toast.success(result.message);
    };

    const handleSubmit = async (data) => {
        try {

            const response = isEditMode
                ? await updateDepartment(data)
                : await createDepartment(data);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            if (isEditMode) {
                const updatedDepartments = departments.map(department => {
                    if (department.departmentId === data.departmentId) {
                        return { ...department, ...response.data };
                    }
                    return department;
                });
                setDepartments(updatedDepartments);
                localStorage.setItem('departments', JSON.stringify(updatedDepartments));
            } else {
                setDepartments([...departments, response.data]);
                localStorage.setItem('departments', JSON.stringify([...departments, response.data]));
            }

            toast.success(response.message);
            closeModal();
        } catch (error) {
            toast.error('An error occurred while processing the request.');
        }
    };

    const handleAddClick = () => {
        setDepartment({
            departmentId: null,
            departmentName: '',
        });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setDepartment({
            departmentId: item.departmentId,
            departmentName: item.departmentName,
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Box sx={{ p: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant={isSmallScreen ? 'h5' : 'h4'} marginBottom={2}>
                        Department Page
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
                    data={departments}
                    columns={COLUMNS}
                    movilColumns={MOVIL_COLUMNS}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    getId={(item) => item.departmentId}
                    isLoading={isLoadingData}
                />
            </Box>

            <CustomModal
                open={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? EDIT_DEPARTMENT_TEXT : ADD_DEPARTMENT_TEXT}
                content={
                    <Form
                        fields={FIELDS}
                        onSubmit={handleSubmit}
                        submitValue={isEditMode ? UPDATE_TEXT : CREATE_TEXT}
                        defaultValues={isEditMode ? department : {}}
                    />
                }
                sx={{
                    width: isSmallScreen ? '90%' : '50%',
                    margin: 'auto',
                }}
            />

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

export default Department;
