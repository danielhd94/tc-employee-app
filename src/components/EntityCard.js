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
    return (
        <Card elevation={3} sx={{ padding: '16px', ...sx }}>
            <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    {fieldsConfig
                        .filter((field) => field.type === 'img')
                        .map((field) => (
                            <Avatar
                                key={`img_${field.name}`}
                                src={variables.PHOTO_URL + (entity[field.name] || 'anonymous.png')}
                                sx={{ width: '4rem', height: '4rem' }}
                            />
                        ))}

                </Box>
                {fieldsConfig
                    .filter(({ type }) => type !== 'img')
                    .map(({ name }) => {
                        const fieldValue = entity[name];
                        const displayValue = typeof fieldValue === 'object' ? fieldValue.label : fieldValue;
                        return (
                            <div key={`text_${name}`}>
                                <Typography variant="h6">
                                    <strong>{displayValue}</strong>
                                </Typography>
                            </div>
                        );
                    })}

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
