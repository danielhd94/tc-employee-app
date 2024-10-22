import React, { useState, useEffect } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Button, Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Card, CardContent, Divider, Avatar } from '@mui/material';
import { format, addDays } from 'date-fns';
import es from 'date-fns/locale/es';
import { fetchEmployees } from '../api/employeeApi.js';
import { User, Clock, Calendar } from 'lucide-react';
import { useTime } from '../hooks/useTime.ts';
import { variables } from '../utils/Variables';

const transformEmployees = (employees) => {
    return employees.map(employee => ({
        id: employee.employeeId.toString(),
        name: employee.employeeName,
        rate: employee.rate,
        overtimeRate: employee.overtimeRate,
        departmentId: employee.department.departmentId.toString(),
        dateOfJoining: employee.dateOfJoining.split('T')[0],
        photoFileName: employee.photoFileName,
        genderId: employee.gender.genderId.toString(),
        employeeCode: employee.employeeCode
    }));
};

const TimeSheet = () => {
        const [weekStart, setWeekStart] = useState(new Date());
        const [isLoadingData, setIsLoadingData] = useState(true);
        const [employees, setEmployees] = useState([]);
        const { timeData: datatime, isLoadingTimeData, addTimeData } = useTime('usetime', true);

        const fetchApiData = async (apiFunction, setData, storageKey, errorMessage) => {
            setIsLoadingData(true);
            try {
                const response = await apiFunction();
                if (response.success) {
                    const transformedEmployees = transformEmployees(response.data);
                    setData(transformedEmployees);
                    localStorage.setItem(storageKey, JSON.stringify(transformedEmployees)); // Cambia a transformedEmployees
                } else {
                    console.error(errorMessage);
                }
            } catch (error) {
                console.error(`An error occurred while fetching data: ${error}`);
            } finally {
                setIsLoadingData(false);
            }
        };

        useEffect(()=>{
            if (!isLoadingTimeData) {
                setTimeData(datatime);
            }
        }, [isLoadingTimeData]);

        useEffect(() => {
            fetchApiData(fetchEmployees, setEmployees, 'employeeDataRegister', 'Failed to fetch employee data');
        }, []);

        const [selectedEmployee, setSelectedEmployee] = useState('');
        const [selectedDay, setSelectedDay] = useState(0);
    const [timeData, setTimeData] = useState({});
        const isMobile = window.innerWidth < 600;

        if (isLoadingTimeData) {
            return (<h1>Cargando...</h1>); // Maneja ambos estados de carga
        }

        const filteredEmployees = selectedEmployee
            ? employees.filter((employee) => employee.id === selectedEmployee)
            : employees;

        const handleTimeChange = (dateString, employeeId, field, value) => {
            // Verificar que los parámetros requeridos no estén indefinidos
            if (!dateString || !employeeId || !field) {
                console.error("Missing required parameters");
                return; // Salir si falta algún parámetro esencial
            }

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



        const handleSubmit = async () => {
            try {
                // This could be an API call to register the time data in a database
                const response = await fetch(`${variables.API_URL}EmployeeTime/time-records`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(timeData),
                });

                if (!response.success) {
                    throw new Error('Failed to register time data');
                }
            } catch (error) {
                console.error('Error during submission:', error);
            }
        };


        const calculateHours = (entrada, salida) => {
            if (!entrada || !salida) return 0;
            const start = new Date(`2000-01-01T${entrada}`);
            const end = new Date(`2000-01-01T${salida}`);
            let diff = (end - start) / 3600000;
            if (diff < 0) diff += 24;
            return diff;
        };

        const calculateTotalHours = (employeeId) => {
            let total = 0;
            Object.values(timeData).forEach(day => {
                if (day[employeeId]) {
                    const regularHours = calculateHours(day[employeeId].entryTime, day[employeeId].exitTime);
                    const extraHours = parseFloat(day[employeeId].overtimeHours) || 0;
                    const sickHours = parseFloat(day[employeeId].sickLeaveHours) || 0;
                    const vacationHours = parseFloat(day[employeeId].vacationHours) || 0;
                    const holidayHours = parseFloat(day[employeeId].holidayHours) || 0;
                    const otherHours = parseFloat(day[employeeId].otherHours) || 0;
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
                    const regularHours = calculateHours(day[employeeId].entryTime, day[employeeId].exitTime);
                    const extraHours = parseFloat(day[employeeId].overtimeHours) || 0;
                    const sickHours = parseFloat(day[employeeId].sickLeaveHours) || 0;
                    const vacationHours = parseFloat(day[employeeId].vacationHours) || 0;
                    const holidayHours = parseFloat(day[employeeId].holidayHours) || 0;
                    const otherHours = parseFloat(day[employeeId].otherHours) || 0;

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
                <Box sx={{ maxWidth: '100%', margin: '0 auto', padding: 2 }}>
                    {filteredEmployees.map((employee) => (
                        <Card key={employee.id} sx={{ mb: 2, boxShadow: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                        <User />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{employee.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {employee.employeeCode}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Entrada"
                                            type="time"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.entryTime || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'entryTime', e.target.value)}
                                            inputProps={{ step: 300 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Salida"
                                            type="time"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.exitTime || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'exitTime', e.target.value)}
                                            inputProps={{ step: 300 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Horas Extra"
                                            type="number"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.overtimeHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'overtimeHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Enfermedad"
                                            type="number"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.sickLeaveHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'sickLeaveHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Vacaciones"
                                            type="number"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.vacationHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'vacationHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Días Festivos"
                                            type="number"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.holidayHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'holidayHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Otros"
                                            type="number"
                                            fullWidth
                                            value={timeData[dateString]?.[employee.id]?.otherHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'otherHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 2, textAlign: 'right' }}>
                                    <Typography variant="body1" color="primary.main" fontWeight="bold">
                                        Total Horas: {calculateTotalHours(employee.id)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            );
        };

        const renderDesktopView = () => {
            const currentDay = addDays(weekStart, selectedDay);
            const dateString = format(currentDay, 'yyyy-MM-dd');

            return (
                <TableContainer component={Paper} sx={{ boxShadow: 3, mt: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white' }}>Empleado</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Entrada</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Salida</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Horas Extra</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Enfermedad</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Vacaciones</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Días Festivos</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Otro</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Total Horas</TableCell>
                                <TableCell align="center" sx={{ color: 'white' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees.map((employee) => (
                                <TableRow key={employee.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}>
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                                <User />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {employee.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {employee.employeeCode}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="time"
                                            value={timeData[dateString]?.[employee.id]?.entryTime || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'entryTime', e.target.value)}
                                            size="small"
                                            InputProps={{
                                                startAdornment: <Clock size={16} color="#666" style={{ marginRight: 8 }} />,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="time"
                                            value={timeData[dateString]?.[employee.id]?.exitTime || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'exitTime', e.target.value)}
                                            inputProps={{ step: 300 }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            value={timeData[dateString]?.[employee.id]?.overtimeHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'overtimeHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            value={timeData[dateString]?.[employee.id]?.sickLeaveHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'sickLeaveHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            value={timeData[dateString]?.[employee.id]?.vacationHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'vacationHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            value={timeData[dateString]?.[employee.id]?.holidayHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'holidayHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            value={timeData[dateString]?.[employee.id]?.otherHours || ''}
                                            onChange={(e) => handleTimeChange(dateString, employee.id, 'otherHours', e.target.value)}
                                            inputProps={{ step: 0.5, min: 0 }}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                                            {calculateTotalHours(employee.id)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button onClick={handleSubmit} variant="contained" color="primary">
                                            Registrar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        };

        return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Box sx={{ p: 2, bgcolor: 'background.default', minHeight: '100vh' }}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Horarios de Trabajo Semanales
                    </Typography>
                    <Paper sx={{ p: 2, mb: 3, boxShadow: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <DatePicker
                                    label="Semana de Inicio"
                                    value={weekStart}
                                    onChange={(newValue) => setWeekStart(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    InputProps={{
                                        startAdornment: <Calendar size={20} color="#666" style={{ marginRight: 8 }} />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Empleado</InputLabel>
                                    <Select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        startAdornment={<User size={20} color="#666" style={{ marginRight: 8 }} />}
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
                                        startAdornment={<Calendar size={20} color="#666" style={{ marginRight: 8 }} />}
                                    >
                                        {renderDayOptions()}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                    {isMobile ? renderMobileView() : renderDesktopView()}
                </Box>
            </LocalizationProvider>
        );
    };

    export default TimeSheet;