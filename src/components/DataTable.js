import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function DataTable({
    data,
    columns,
    getId = (item) => item.id,
    isLoading = false,
}) {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                getRowId={(row) => getId(row)}
                loading={isLoading}
                rows={data}
                pagination
                columns={columns}
                checkboxSelection={false}
                disableSelectionOnClick
                disableColumnMenu={false}
                autoHeight
                rowCount={data?.length}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                pageSizeOptions={[5, 10, 20, 50, 100]}
            />
        </div>
    );
}

export default DataTable;
