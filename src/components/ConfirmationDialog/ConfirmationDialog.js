import React from 'react';
import Modal from 'react-modal';
import './ConfirmationDialog.css'; // Importa tus estilos personalizados aquí

// Establece el elemento raíz para que react-modal funcione correctamente.
Modal.setAppElement('#root');

function ConfirmationDialog({ isOpen, onCancel, onConfirm }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel="Confirm Dialog"
            className="confirmation-dialog"
            overlayClassName="confirmation-dialog-overlay"
        >
            <div className="confirmation-content">
                <h2>Confirmación</h2>
                <p>¿Estás seguro de que deseas continuar?</p>
                <div className="confirmation-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel-button" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmationDialog;
