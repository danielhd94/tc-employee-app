import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    ButtonGroup,
    Button,
    Avatar,
} from '@mui/material';
import { variables } from '../utils/Variables';

const EntityCard = ({ entity, actionsConfig, fieldsConfig, sx }) => {
    const im = fieldsConfig
        .filter((field) => field.type === 'image') // Asegúrate de que esto coincida con tu configuración
        .map((field) => (
            <Avatar
                key={`img_${field.name}`}
                src={variables.PHOTO_URL + (entity[field.name] || 'anonymous.png')}
                sx={{ width: '4rem', height: '4rem' }}
            />
        ))

    return (
        <Card elevation={3} sx={{ padding: '16px', ...sx }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    {/* Render avatar image if available */}
                    {fieldsConfig
                        .filter((field) => field.type === 'image') // Asegúrate de que esto coincida con tu configuración
                        .map((field) => (
                            <Avatar
                                key={`img_${field.name}`}
                                src={variables.PHOTO_URL + (entity[field.name] || 'anonymous.png')}
                                sx={{ width: '4rem', height: '4rem' }}
                            />
                        ))}
                </Box>
                {/* Render other fields */}
                {fieldsConfig
                    .filter(({ type }) => type !== 'image') // Cambia 'img' por 'image'
                    .map(({ name, label }) => {
                        const fieldValue = entity[name];
                        const displayValue = typeof fieldValue === 'object' ? fieldValue.label : fieldValue || 'N/A'; // Manejo de valor vacío
                        return (
                            <div key={`text_${name}`}>
                                <Typography variant="h6">
                                    <strong>{label}: {displayValue}</strong>
                                </Typography>
                            </div>
                        );
                    })}

                {/* Render action buttons */}
                {actionsConfig && (
                    <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface', mt: 2 }}>
                        <Button onClick={actionsConfig.handleEdit}>Edit</Button>
                        <Button onClick={actionsConfig.handleDelete}>Delete</Button>
                    </ButtonGroup>
                )}
            </CardContent>
        </Card>
    );
};

export default EntityCard;
