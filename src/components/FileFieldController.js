import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
    FormControl,
    Input,
    InputLabel,
    Avatar,
    IconButton,
    Tooltip,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export function FileFieldController({ name, control, label, handleFileChange, fileImage, defaultValue }) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
        handleFileChange(e, { name });
    };

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ''}
            render={({ field }) => (
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Input
                        type="file"
                        id="file-input"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    <div
                        style={{
                            position: 'relative',
                            width: '100px',
                            height: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Avatar
                            alt="photo profile"
                            src={selectedImage || fileImage}
                            sx={{ width: '100%', height: '100%' }}
                        />
                        {isHovered && (
                            <Tooltip title="Cambiar imagen">
                                <IconButton
                                    color="primary"
                                    component="span"
                                    style={{
                                        position: 'absolute',
                                    }}
                                    onClick={handleImageChange}
                                >
                                    <PhotoCameraIcon
                                        fontSize="large"
                                        onClick={() => {
                                            const fileInput = document.getElementById('file-input');
                                            if (fileInput) {
                                                fileInput.click();
                                            }
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </div>
                </FormControl>
            )}
        />
    );
}
