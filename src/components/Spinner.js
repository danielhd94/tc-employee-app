import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function Spinner() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <CircularProgress />
            <p>Loading...</p>
        </div>
    );
}

export default Spinner;
