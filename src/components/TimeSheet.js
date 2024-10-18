import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format, addDays, startOfWeek } from 'date-fns';

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
    const [timeData, setTimeData] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedDay, setSelectedDay] = useState(0);

    useEffect(() => {
        initializeWeek();
    }, [weekStart]);

    const renderDayOptions = () => {
        return renderWeekDays().map((day, index) => (
            <MenuItem key={index} value={index}>
                {format(day, 'EEEE, d MMMM', { locale: es })}
            </MenuItem>
        ));
    };

    const initializeWeek = () => {
        const newTimeData = {};
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            const dateString = day.toISOString().split('T')[0];
            newTimeData[dateString] = {};
            employees.forEach(employee => {
                newTimeData[dateString][employee.id] = {
                    entrada: '',
                    salida: '',
                    horasHabituales: 0,
                    horasExtra: 0,
                    enfermedad: 0,
                    vacaciones: 0,
                    diasFestivos: 0,
                    otro: 0
                };
            });
        }
        setTimeData(newTimeData);
    };

    const handleTimeChange = (date, employeeId, field, value) => {
        setTimeData(prevData => ({
            ...prevData,
            [date]: {
                ...prevData[date],
                [employeeId]: {
                    ...prevData[date][employeeId],
                    [field]: value
                }
            }
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

    const renderWeekDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const filteredEmployees = selectedEmployee
        ? employees.filter(emp => emp.id === selectedEmployee)
        : employees;

    const renderMobileView = () => {
        const currentDay = addDays(weekStart, selectedDay);
        const dateString = format(currentDay, 'yyyy-MM-dd');

        return (
            <Box
                sx={{
                    maxWidth: { xs: '100%', sm: '600px', md: '800px' }, // Cambia estos valores según tus necesidades
                    margin: '0 auto', // Centra el contenedor
                    padding: 2, // Espaciado interno
                }}
            >
            <Box
                sx={{
                    display: 'flex',
                    overflowX: 'auto', // Habilitar scroll horizontal
                    pb: 2, // Espacio inferior para evitar corte
                    flexDirection: 'row', // Alinear tarjetas en fila
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
                    width: "300px", // Ancho total en dispositivos móviles
                    maxHeight: "80vh", // Altura máxima para el scroll
                    overflowY: 'hidden', // Evitar el scroll vertical
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
                                <TableCell align="center">{calculateTotalHours(employee.id)}</TableCell>
                                <TableCell align="center">${calculateTotalPay(employee.id)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Box sx={{ maxWidth: '100%', overflowX: 'auto', p: 2 }}>
                <Typography variant="h4" gutterBottom align="center">
                    TU CASA RESTAURANT LLC - HORARIO DE TRABAJO
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DatePicker
                            label="Inicio de la Semana"
                            value={weekStart}
                            onChange={(newValue) => setWeekStart(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="employee-select-label">Empleado</InputLabel>
                            <Select
                                labelId="employee-select-label"
                                id="employee-select"
                                value={selectedEmployee}
                                label="Empleado"
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {employees.map((employee) => (
                                    <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="day-select-label">Día</InputLabel>
                            <Select
                                labelId="day-select-label"
                                id="day-select"
                                value={selectedDay}
                                label="Día"
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                {renderDayOptions()}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                {isMobile ? renderMobileView() : renderDesktopView()}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => console.log(timeData)}
                    >
                        Guardar Registro
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default TimeSheet;