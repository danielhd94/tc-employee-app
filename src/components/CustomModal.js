import React from 'react';
import { Modal, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

const StyledModalContent = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    maxWidth: '90%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5], // Cambio a sombra más suave (5)
    padding: theme.spacing(4), // Espacio interior más grande
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(2), // Mayor padding
    borderRadius: theme.shape.borderRadius,
}));

function CustomModal({
    open = false, // Valor predeterminado para evitar que sea undefined
    onClose,
    title,
    content,
    actions = null,
    closeIcon = true,
}) {

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <StyledModalContent>
                {closeIcon && (
                    <IconButton onClick={handleClose} aria-label="close" sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                )}
                <StyledTitle variant="h5" gutterBottom>
                    {title}
                </StyledTitle>
                {content}
                {actions}
            </StyledModalContent>
        </Modal>
    );
}

export default CustomModal;
