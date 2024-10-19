import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { format, addDays } from 'date-fns';
import es from 'date-fns/locale/es';

const TimeSheet = () => {
    const [weekStart, setWeekStart] = useState(new Date());
    const [employees, setEmployees] = useState([
        { id: '1001', name: 'Isaac', rate: 18, overtimeRate: 25 },
        { id: '1002', name: 'Erlinda', rate: 18, overtimeRate: 25 },
        { id: '1003', name: 'Jose', rate: 18, overtimeRate: 25 },
        { id: '1004', name: 'Milagros', rate: 18, overtimeRate: 25 },
        { id: '1005', name: 'David', rate: 18, overtimeRate: 25 },
        { id: '1006', name: 'Hugo', rate: 18, overtimeRate: 25 },
    ]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDay, setSelectedDay] = useState(0);
    const [timeData, setTimeData] = useState({});
    const isMobile = window.innerWidth < 600;

    const filteredEmployees = selectedEmployee
        ? employees.filter((employee) => employee.id === selectedEmployee)
        : employees;

    const handleTimeChange = (dateString, employeeId, field, value) => {
        setTimeData((prevData) => ({
            ...prevData,
            [dateString]: {
                ...prevData[dateString],
                [employeeId]: {
                    ...prevData[dateString]?.[employeeId],
                    [field]: value,
                },
            },
        }));
    };

    const calculateHours = (entrada, salida) => {
        if (!entrada || !salida) return 0;
        const start = new Date(`2000-01-01T${entrada}`);
        const end = new Date(`2000-01-01T${salida}`);
        let diff = (end - start) / 3600000; // difference in hours
        if (diff < 0) diff += 24; // if end time is on the next day
        return diff;
    };

    const calculateTotalHours = (employeeId) => {
        let total = 0;
        Object.values(timeData).forEach(day => {
            if (day[employeeId]) {
                const regularHours = calculateHours(day[employeeId].entrada, day[employeeId].salida);
                const extraHours = parseFloat(day[employeeId].horasExtra) || 0;
                const sickHours = parseFloat(day[employeeId].enfermedad) || 0;
                const vacationHours = parseFloat(day[employeeId].vacaciones) || 0;
                const holidayHours = parseFloat(day[employeeId].diasFestivos) || 0;
                const otherHours = parseFloat(day[employeeId].otro) || 0;
                total += regularHours + extraHours + sickHours + vacationHours + holidayHours + otherHours;
            }
        });
        return total.toFixed(2);
    };

    const calculateTotalPay = (employeeId) => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!employee) return 0;

        let totalPay = 0;
        Object.values(timeData).forEach(day => {
            if (day[employeeId]) {
                const regularHours = calculateHours(day[employeeId].entrada, day[employeeId].salida);
                const extraHours = parseFloat(day[employeeId].horasExtra) || 0;
                const sickHours = parseFloat(day[employeeId].enfermedad) || 0;
                const vacationHours = parseFloat(day[employeeId].vacaciones) || 0;
                const holidayHours = parseFloat(day[employeeId].diasFestivos) || 0;
                const otherHours = parseFloat(day[employeeId].otro) || 0;

                totalPay += regularHours * employee.rate;
                totalPay += extraHours * employee.overtimeRate;
                totalPay += (sickHours + vacationHours + holidayHours + otherHours) * employee.rate;
            }
        });
        return totalPay.toFixed(2);
    };

    const renderDayOptions = () => {
        const options = [];
        for (let i = 0; i < 7; i++) {
            const currentDay = addDays(weekStart, i);
            options.push(
                <MenuItem key={i} value={i}>
                    {format(currentDay, 'EEEE dd/MM/yyyy', { locale: es })}
                </MenuItem>
            );
        }
        return options;
    };

    const renderMobileView = () => {
        const currentDay = addDays(weekStart, selectedDay);
        const dateString = format(currentDay, 'yyyy-MM-dd');

        return (
            <Box
                sx={{
                    maxWidth: { xs: '100%', sm: '600px', md: '800px' },
                    margin: '0 auto',
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        pb: 2,
                        flexDirection: 'row',
                        gap: 2,
                        scrollbarWidth: 'thin',
                        msOverflowStyle: 'auto',
                        '&::-webkit-scrollbar': {
                            height: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#555',
                        },
                        width: "300px",
                        maxHeight: "80vh",
                        overflowY: 'hidden',
                    }}
                >
                    {filteredEmployees.map((employee) => (
                        <Paper key={employee.id} sx={{ mb: 2, p: 2, width: "300px", flexShrink: 0 }}>
                            <Typography variant="h6" gutterBottom>
                                {employee.name} (ID: {employee.id})
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Entrada"
                                        type="time"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.entrada || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'entrada', e.target.value)}
                                        inputProps={{ step: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Salida"
                                        type="time"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.salida || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'salida', e.target.value)}
                                        inputProps={{ step: 300 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Horas Extra"
                                        type="number"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.horasExtra || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'horasExtra', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Enfermedad"
                                        type="number"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.enfermedad || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'enfermedad', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Vacaciones"
                                        type="number"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.vacaciones || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'vacaciones', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Días Festivos"
                                        type="number"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.diasFestivos || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'diasFestivos', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Otros"
                                        type="number"
                                        fullWidth
                                        value={timeData[dateString]?.[employee.id]?.otro || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'otro', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="body1" mt={2}>
                                Total Horas: {calculateTotalHours(employee.id)}
                            </Typography>
                            <Typography variant="body1" mt={1}>
                                Total a Pagar: ${calculateTotalPay(employee.id)}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderDesktopView = () => {
        const currentDay = addDays(weekStart, selectedDay);
        const dateString = format(currentDay, 'yyyy-MM-dd');

        return (
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Empleado (ID)</TableCell>
                            <TableCell align="center">Entrada</TableCell>
                            <TableCell align="center">Salida</TableCell>
                            <TableCell align="center">Horas Extra</TableCell>
                            <TableCell align="center">Enfermedad</TableCell>
                            <TableCell align="center">Vacaciones</TableCell>
                            <TableCell align="center">Días Festivos</TableCell>
                            <TableCell align="center">Otro</TableCell>
                            <TableCell align="center">Total Horas (Semana)</TableCell>
                            <TableCell align="center">Total a Pagar (Semana)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell component="th" scope="row">
                                    {employee.name} ({employee.id})
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="time"
                                        value={timeData[dateString]?.[employee.id]?.entrada || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'entrada', e.target.value)}
                                        inputProps={{ step: 300 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="time"
                                        value={timeData[dateString]?.[employee.id]?.salida || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'salida', e.target.value)}
                                        inputProps={{ step: 300 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number"
                                        value={timeData[dateString]?.[employee.id]?.horasExtra || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'horasExtra', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number"
                                        value={timeData[dateString]?.[employee.id]?.enfermedad || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'enfermedad', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number"
                                        value={timeData[dateString]?.[employee.id]?.vacaciones || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'vacaciones', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number"
                                        value={timeData[dateString]?.[employee.id]?.diasFestivos || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'diasFestivos', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TextField
                                        type="number"
                                        value={timeData[dateString]?.[employee.id]?.otro || ''}
                                        onChange={(e) => handleTimeChange(dateString, employee.id, 'otro', e.target.value)}
                                        inputProps={{ step: 0.5, min: 0 }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {calculateTotalHours(employee.id)}
                                </TableCell>
                                <TableCell align="center">
                                    ${calculateTotalPay(employee.id)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Horarios de Trabajo Semanales
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <DatePicker
                            label="Semana de Inicio"
                            value={weekStart}
                            onChange={(newValue) => setWeekStart(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Empleado</InputLabel>
                            <Select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Día de la Semana</InputLabel>
                            <Select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                {renderDayOptions()}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {isMobile ? renderMobileView() : renderDesktopView()}
            </Box>
        </LocalizationProvider>
    );
};

export default TimeSheet;