import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from "@hookform/devtools";
import {
    Button,
    Grid,
    Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { variables } from '../utils/Variables';
import { uploadEmployeeFile } from '../api/employeeApi';
import { SelectFieldController } from './SelectFieldController';
import { FileFieldController } from './FileFieldController';
import { TextFieldController } from './TextFieldController';

const nowInCDMX = new Date().toLocaleString('en-US', {
    timeZone: 'America/Mexico_City',
});
const [date] = nowInCDMX.split(', ');
const [month, day, year] = date.split('/');
const today = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    padding: '16px',
});

const StyledPaper = styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '24px',
});

function Form({ fields, onSubmit, submitValue, defaultValues }) {
    const PhotoPath = variables.PHOTO_URL;
    const { control, handleSubmit, setValue } = useForm({
        defaultValues: defaultValues,
    });

    const [fileImage, setFileImage] = useState(null);

    useEffect(() => {
        const existingImageUrl = defaultValues['photoFileName'];
        if (existingImageUrl) {
            setFileImage(PhotoPath + existingImageUrl);
        }
    }, [PhotoPath, defaultValues]);

    const handleFileChange = async (e, headerField) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            try {
                const response = await uploadEmployeeFile(uploadedFile);
                setValue(headerField.name, response.data);
                setFileImage(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <StyledPaper elevation={3}>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    {fields.map((headerField, index) => (
                        <Grid item xs={12} key={index}>
                            {headerField.type === 'select' && (
                                <SelectFieldController
                                    name={headerField.name}
                                    control={control}
                                    label={headerField.label}
                                    options={headerField.options}
                                    defaultValue={defaultValues[headerField.name] ? defaultValues[headerField.name].vale : ''}
                                />
                            )}
                            {headerField.type === 'file' && (
                                <FileFieldController
                                    name={headerField.name}
                                    control={control}
                                    label={headerField.label}
                                    handleFileChange={handleFileChange}
                                    fileImage={fileImage || ''}
                                    defaultValue={defaultValues[headerField.name]}
                                />
                            )}
                            {headerField.type !== 'select' && headerField.type !== 'file' && (
                                <TextFieldController
                                    name={headerField.name}
                                    control={control}
                                    label={headerField.label}
                                    type={headerField.type}
                                    defaultValue={headerField.type === 'date' ? today : defaultValues[headerField.name]}
                                    placeholder={`Enter ${headerField.label}`}
                                />
                            )}
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            {submitValue}
                        </Button>
                    </Grid>
                </Grid>
            </StyledForm>
            <DevTool control={control}/>
        </StyledPaper>
    );
}

export default Form;
