import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format, addDays } from 'date-fns';

const WeeklyReport = () => {
    const [weekStart, setWeekStart] = useState(new Date());
    const [employeeData, setEmployeeData] = useState([
        { id: '1001', name: 'ISAAC', rate: 15 },
        { id: '1002', name: 'ERLINDA', rate: 15 },
        { id: '1003', name: 'JOSE', rate: 15 },
        { id: '1004', name: 'MILAGROS', rate: 15 },
        { id: '1005', name: 'DAVID', rate: 15 },
        { id: '1006', name: 'HUGO', rate: 15 },
    ]);

    const [weeklyHours, setWeeklyHours] = useState({});

    useEffect(() => {
        const simulatedData = {};
        employeeData.forEach(employee => {
            simulatedData[employee.id] = Array(7).fill().map(() => Math.floor(Math.random() * 8) + 4);
        });
        setWeeklyHours(simulatedData);
    }, [weekStart]);

    const calculateTotalHours = (hours) => hours.reduce((sum, hour) => sum + hour, 0);
    const calculateTotalPay = (hours, rate) => calculateTotalHours(hours) * rate;

    const renderWeekDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = addDays(weekStart, i);
            days.push(format(day, 'dd/MM/yyyy'));
        }
        return days;
    };

    // Verifica si está en vista móvil
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: '100%', overflowX: 'hidden' }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    textAlign="center"
                    sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }, mb: { xs: 2, sm: 3 } }}
                >
                    TU CASA RESTAURANT LLC - REPORTE SEMANAL DE HORAS
                </Typography>
                <Grid container spacing={2} justifyContent="center" sx={{ mb: { xs: 2, sm: 4 } }}>
                    <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Inicio de la Semana"
                            value={weekStart}
                            onChange={(newValue) => setWeekStart(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                </Grid>

                {/* Condicional para mostrar tarjetas en móvil y tabla en desktop */}
                {isMobile ? (
                    <Box
                        sx={{
                            display: 'flex',
                            overflowX: 'auto', // Habilitar scroll horizontal
                            pb: 2, // Espacio inferior para evitar corte
                            flexDirection: 'row', // Alinear cards en fila
                            gap: 2, // Espacio entre tarjetas
                            scrollbarWidth: 'thin', // Scrollbar delgada para Firefox
                            msOverflowStyle: 'auto', // Asegurar estilo de scrollbar para IE y Edge
                            '&::-webkit-scrollbar': {
                                height: '8px', // Altura del scrollbar
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#888', // Color del thumb
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#555', // Color del thumb al pasar el mouse
                            },
                            width: "300px"
                        }}
                    >
                        {employeeData.map((employee) => {
                            const hours = weeklyHours[employee.id] || Array(7).fill(0);
                            const totalHours = calculateTotalHours(hours);
                            const totalPay = calculateTotalPay(hours, employee.rate);
                            return (
                                <Card key={employee.id} sx={{ minWidth: 250, flexShrink: 0 }}>
                                    <CardContent>
                                        <Typography variant="h6">{employee.name}</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        {renderWeekDays().map((day, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">{day}:</Typography>
                                                <Typography variant="body2">{hours[index]} horas</Typography>
                                            </Box>
                                        ))}
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Total Horas:</Typography>
                                            <Typography variant="body2">{totalHours}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Tarifa por Hora:</Typography>
                                            <Typography variant="body2">${employee.rate.toFixed(2)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Total a Pagar:</Typography>
                                            <Typography variant="body2">${totalPay.toFixed(2)}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>
                ) : (
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Empleado</TableCell>
                                    {renderWeekDays().map((day, index) => (
                                        <TableCell key={index}>{day}</TableCell>
                                    ))}
                                    <TableCell>Total Horas</TableCell>
                                    <TableCell>Tarifa por Hora</TableCell>
                                    <TableCell>Total a Pagar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employeeData.map((employee) => {
                                    const hours = weeklyHours[employee.id] || Array(7).fill(0);
                                    const totalHours = calculateTotalHours(hours);
                                    const totalPay = calculateTotalPay(hours, employee.rate);
                                    return (
                                        <TableRow key={employee.id}>
                                            <TableCell>{employee.name}</TableCell>
                                            {hours.map((hour, index) => (
                                                <TableCell key={index}>{hour} horas</TableCell>
                                            ))}
                                            <TableCell>{totalHours}</TableCell>
                                            <TableCell>${employee.rate.toFixed(2)}</TableCell>
                                            <TableCell>${totalPay.toFixed(2)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default WeeklyReport;
