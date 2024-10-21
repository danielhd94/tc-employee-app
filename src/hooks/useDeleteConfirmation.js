import { useState } from 'react';
import { toast } from 'react-toastify';

function useDeleteConfirmation(employees, setEmployees) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setShowConfirmation(true);
    };

    const handleCancelDelete = () => {
        setItemToDelete(null);
        setShowConfirmation(false);
    };

    const handleConfirmDelete = async (deleteFn) => {
        try {
            const response = await deleteFn(itemToDelete);

            if (!response.success) {
                toast.error(response.message || 'Error deleting the item.');
                return response;
            }

            // Update the employees list after deletion
            const updatedEmployees = employees.filter(emp => emp.employeeId !== itemToDelete);
            setEmployees(updatedEmployees);

            localStorage.setItem('employeeData', JSON.stringify(updatedEmployees));
            toast.success('Employee deleted successfully.');

            setItemToDelete(null);
            setShowConfirmation(false);
            return response;

        } catch (error) {
            toast.error('An error occurred while deleting.');
            setItemToDelete(null);
            setShowConfirmation(false);
            return { success: false, message: error.message };
        }
    };

    return {
        showConfirmation,
        itemToDelete,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete
    };
}

export default useDeleteConfirmation;
