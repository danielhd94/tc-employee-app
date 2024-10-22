import React, { Suspense, lazy } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import EntityCard from './EntityCard';
import Spinner from './Spinner';

const DataTable = lazy(() => import('./DataTable'));

const ResponsiveTable = ({
    data = [],
    columns,
    movilColumns = [],
    onEdit,
    onDelete,
    getId,
    isLoading = false,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return (
            <Grid container spacing={2} sx={{ pt: 2 }}>
                <Grid item xs={12}>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <EntityCard
                                key={getId(item)}
                                entity={item}
                                actionsConfig={{
                                    handleEdit: () => onEdit(item),
                                    handleDelete: () => onDelete(getId(item)),
                                }}
                                fieldsConfig={movilColumns.length > 0 ? movilColumns.map((column) => ({
                                    name: column.field,
                                    label: column.label,
                                    type: column.type ?? 'text',
                                })) : [
                                    { name: 'employeeCode', label: 'Código', type: 'text' },
                                    { name: 'employeeName', label: 'Nombre', type: 'text' },
                                    { name: 'dateOfJoining', label: 'Fecha de Ingreso', type: 'date' },
                                    { name: 'photoFileName', label: 'Foto', type: 'image' },
                                ]}
                                sx={{ marginBottom: 2 }}
                            />
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                            No hay datos disponibles.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <TableContainer sx={{ overflowX: 'auto', pt: 2 }}>
                <Suspense fallback={<Spinner />}>
                    <DataTable
                        data={data}
                        columns={columns}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        getId={getId}
                        isLoading={isLoading}
                    />
                </Suspense>
            </TableContainer>
        );
    }
};

export default ResponsiveTable;
