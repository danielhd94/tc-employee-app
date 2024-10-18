import React from 'react';
import { Controller,  } from 'react-hook-form';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

export function SelectFieldController({ name, control, label, options, defaultValue, optionLabelKey = 'label', optionValueKey = 'value' }) {
    const isOptionObject = options.length > 0 && typeof options[0] === 'object';
    const getDefaultValue = () => {
        if (defaultValue?.value) {
            return defaultValue.value;
        }

        return isOptionObject ? options[0][optionValueKey] : options[0].value;
    };

    const selectedValue = getDefaultValue();

    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Controller
                name={name}
                control={control}
                defaultValue={selectedValue}
                render={({ field }) => (
                    <Select
                        {...field}
                        label={label}
                    >
                        {options?.map((option, optionIndex) => (
                            <MenuItem key={optionIndex} value={isOptionObject ? option[optionValueKey] : option.value}>
                                {isOptionObject ? option[optionLabelKey] : option.label}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        </FormControl>
    );
}
