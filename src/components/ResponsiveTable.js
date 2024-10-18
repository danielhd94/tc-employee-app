import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import EntityCard from './EntityCard';
import Spinner from './Spinner';
import Loadable from 'react-loadable';

const DataTable = Loadable({
    loader: () => import('./DataTable'),
    loading: () => Spinner,
});

const ResponsiveTable = ({
    data,
    columns,
    movilColumns,
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
                    {data.map((item) => (
                        <EntityCard
                            key={getId(item)}
                            entity={item}
                            actionsConfig={{
                                handleEdit: () => onEdit(item),
                                handleDelete: () => onDelete(getId(item)),
                            }}
                            fieldsConfig={movilColumns.map((column) => ({
                                name: column.field,
                                label: column.label,
                                type: column.type ?? 'text',
                            }))}
                            sx={{ marginBottom: 2 }}
                        />

                    ))}
                </Grid>
            </Grid>
        );
    } else {
        return (
            <TableContainer sx={{ overflowX: 'auto', pt: 2 }}>
                <DataTable
                    data={data}
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getId={getId}
                    isLoading={isLoading}
                />
            </TableContainer>
        );
    }
};

export default ResponsiveTable;
