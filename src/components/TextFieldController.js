import React from 'react';
import { Controller } from 'react-hook-form';
import {
    TextField,
} from '@mui/material';

export function TextFieldController({ name, control, label, type, defaultValue, placeholder }) {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
                <TextField
                    {...field}
                    label={label}
                    variant="outlined"
                    fullWidth
                    type={type}
                    placeholder={placeholder}
                />
            )}
        />
    );
}
