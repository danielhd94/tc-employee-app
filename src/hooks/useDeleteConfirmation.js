import { useState } from 'react';

function useDeleteConfirmation() {
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
        const response = await deleteFn(itemToDelete);

        setItemToDelete(null);
        setShowConfirmation(false);


        return response;
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