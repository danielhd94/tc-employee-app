import React, { useState, useEffect, useMemo } from 'react';
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
    useTheme,
    Paper,
    Avatar,
    Button,
    Menu,
    MenuItem,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format, addDays, startOfWeek, endOfWeek, parseISO, differenceInHours } from 'date-fns';
import { fetchEmployees } from '../api/employeeApi.js';
import { User, Calendar, Download, FileText, FileSpreadsheet } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

// Definir una paleta de colores personalizada
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Paleta para modo claro
                primary: {
                    main: '#1976d2',
                },
                secondary: {
                    main: '#dc004e',
                },
                background: {
                    default: '#f5f5f5',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#333333',
                    secondary: '#666666',
                },
            }
            : {
                // Paleta para modo oscuro
                primary: {
                    main: '#90caf9',
                },
                secondary: {
                    main: '#f48fb1',
                },
                background: {
                    default: '#303030',
                    paper: '#424242',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#b0bec5',
                },
            }),
    },
});

const transformEmployees = (employees) => {
    return employees.map(employee => ({
        id: employee.employeeId.toString(),
        name: employee.employeeName,
        rate: employee.rate || 0,
        employeeCode: employee.employeeCode || '',
    }));
};

const WeeklyReport = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme2 = useMemo(
        () => createTheme(getDesignTokens(prefersDarkMode ? 'dark' : 'light')),
        [prefersDarkMode],
    );

    const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
    const [employeeIdFilter, setEmployeeIdFilter] = useState('');
    const [employeeData, setEmployeeData] = useState([]);
    const [weeklyHours, setWeeklyHours] = useState({});
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchApiData = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetchEmployees();
            if (response.success) {
                const transformedEmployees = transformEmployees(response.data);
                setEmployeeData(transformedEmployees);
                localStorage.setItem('employeeDataReports', JSON.stringify(response.data));
            } else {
                console.error('Failed to fetch employee data');
            }
        } catch (error) {
            console.error(`An error occurred while fetching data: ${error}`);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    useEffect(() => {
        const simulatedData = {};
        employeeData.forEach(employee => {
            simulatedData[employee.id] = {};
            for (let i = 0; i < 7; i++) {
                const currentDate = format(addDays(weekStart, i), 'yyyy-MM-dd');
                simulatedData[employee.id][currentDate] = {
                    entrada: '08:00',
                    salida: '17:00',
                    horasExtra: Math.floor(Math.random() * 3),
                    enfermedad: 0,
                    vacaciones: 0,
                    diasFestivos: 0,
                    otro: 0
                };
            }
        });
        setWeeklyHours(simulatedData);
    }, [employeeData, weekStart]);

    const calculateTotalHours = (employeeId) => {
        let total = 0;
        Object.values(weeklyHours[employeeId] || {}).forEach(day => {
            const workHours = day.salida && day.entrada ?
                (new Date(`2000-01-01T${day.salida}`) - new Date(`2000-01-01T${day.entrada}`)) / 3600000 : 0;
            total += workHours + (day.horasExtra || 0) + (day.enfermedad || 0) +
                (day.vacaciones || 0) + (day.diasFestivos || 0) + (day.otro || 0);
        });
        return total.toFixed(2);
    };

    const calculateTotalPay = (employeeId, rate) => {
        return (calculateTotalHours(employeeId) * rate).toFixed(2);
    };

    /*const weekDays = useMemo(() => {
        return Array(7).fill().map((_, i) => format(addDays(weekStart, i), 'dd/MM/yyyy'));
    }, [weekStart]);
*/

    const weekDays = useMemo(() => {
        return Array(7).fill().map((_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));
    }, [weekStart]);

    const filteredEmployees = useMemo(() => {
        return employeeIdFilter
            ? employeeData.filter(employee => employee.employeeCode.includes(employeeIdFilter))
            : employeeData;
    }, [employeeData, employeeIdFilter]);

    const renderMobileView = () => (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: 2,
            maxWidth: '100%',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: theme.palette.grey[600],
            },
        }}>
            {filteredEmployees.map((employee) => {
                const totalHours = calculateTotalHours(employee.id);
                const totalPay = calculateTotalPay(employee.id, employee.rate);
                return (
                    <Card key={employee.id} sx={{ width: '100%' }}>
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
                            <Divider sx={{ my: 1 }} />
                            {weekDays.map((day, index) => (
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">{day}:</Typography>
                                    <Typography variant="body2">
                                        {weeklyHours[employee.id]?.[format(addDays(weekStart, index), 'yyyy-MM-dd')]?.entrada || '-'} -
                                        {weeklyHours[employee.id]?.[format(addDays(weekStart, index), 'yyyy-MM-dd')]?.salida || '-'}
                                    </Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">Total Horas:</Typography>
                                <Typography variant="body2" fontWeight="bold">{totalHours}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );

    const renderDesktopView = () => (
        <TableContainer component={Paper} sx={{ maxHeight: 440, mt: 3, boxShadow: 3 }}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>Empleado</TableCell>
                        {weekDays.map((day, index) => (
                            <TableCell key={index} align="center" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>{day}</TableCell>
                        ))}
                        <TableCell align="center" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>Total Horas</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredEmployees.map((employee) => {
                        const totalHours = calculateTotalHours(employee.id);
                        const totalPay = calculateTotalPay(employee.id, employee.rate);
                        return (
                            <TableRow key={employee.id} sx={{ '&:nth-of-type(odd)': { bgcolor: theme.palette.action.hover } }}>
                                <TableCell component="th" scope="row">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ bgcolor: theme.palette.primary.light, mr: 2 }}>
                                            <User />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                                                {employee.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                {employee.employeeCode}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                {weekDays.map((day, index) => {
                                    const currentDate = format(addDays(weekStart, index), 'yyyy-MM-dd');
                                    const dayData = weeklyHours[employee.id]?.[currentDate];
                                    const dailyHours = calculateDailyHours(dayData);
                                    return (
                                        <TableCell key={index} align="center">
                                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                                {dayData?.entrada || '-'} - {dayData?.salida || '-'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                Total: {dailyHours} hrs
                                            </Typography>
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="center">
                                    <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
                                        {totalHours}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // Función para calcular las horas diarias
    const calculateDailyHours = (dayData) => {
        if (!dayData || !dayData.entrada || !dayData.salida) return '0';
        const start = parseISO(`2000-01-01T${dayData.entrada}`);
        const end = parseISO(`2000-01-01T${dayData.salida}`);
        let hours = differenceInHours(end, start);
        if (hours < 0) hours += 24; // Si el turno cruza la medianoche
        return (hours + (dayData.horasExtra || 0)).toFixed(2);
    };

    const handleDownloadClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte Semanal de Horas", 14, 15);
        doc.autoTable({
            head: [['Empleado', ...weekDays, 'Total Horas', 'Total Pago']],
            body: filteredEmployees.map(employee => [
                employee.name,
                ...weekDays.map(day => {
                    const currentDate = format(new Date(day), 'yyyy-MM-dd');
                    return `${weeklyHours[employee.id]?.[currentDate]?.entrada || '-'} - ${weeklyHours[employee.id]?.[currentDate]?.salida || '-'}`;
                }),
                calculateTotalHours(employee.id),
                `$${calculateTotalPay(employee.id, employee.rate)}`
            ])
        });
        doc.save("reporte_semanal.pdf");
        handleClose();
    };

    const [isDownloading, setIsDownloading] = useState(false);


    const safeDateFormat = (date, formatString) => {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return !isNaN(dateObj.getTime()) ? format(dateObj, formatString) : 'Fecha inválida';
        } catch (error) {
            console.error('Error al formatear fecha:', date, error);
            return 'Error de fecha';
        }
    };

    const downloadExcel = async () => {
        setIsDownloading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 0));

            const ws = XLSX.utils.aoa_to_sheet([
                ['Empleado', ...weekDays, 'Total Horas'],
                ...employeeData.map(employee => [
                    employee.name,
                    ...weekDays.map(day => {
                        const currentDate = safeDateFormat(day, 'yyyy-MM-dd');
                        const dayData = weeklyHours[employee.id]?.[currentDate];
                        return dayData ? `${dayData.entrada || '-'} - ${dayData.salida || '-'}` : '-';
                    }),
                    calculateTotalHours(employee.id),
                ])
            ]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Reporte Semanal");
            XLSX.writeFile(wb, "reporte_semanal.xlsx");
        } catch (error) {
            console.error("Error al generar el archivo Excel:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setIsDownloading(false);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <Box sx={{
                    p: { xs: 2, sm: 4 },
                    maxWidth: '100%',
                    overflowX: 'hidden',
                    bgcolor: 'background.default',
                    color: 'text.primary'
                }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        textAlign="center"
                        sx={{
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                            mb: { xs: 2, sm: 3 },
                            color: 'text.primary'
                        }}
                    >
                        RH KOLAVAL - REPORTE SEMANAL DE HORAS
                    </Typography>
                    <Grid container spacing={2} justifyContent="center" sx={{ mb: { xs: 2, sm: 4 } }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <DatePicker
                                label="Inicio de la Semana"
                                value={weekStart}
                                onChange={(newValue) => setWeekStart(startOfWeek(newValue))}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        fullWidth
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                color: 'text.primary',
                                                bgcolor: 'background.paper',
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'text.secondary',
                                            },
                                        }}
                                    />
                                }
                                InputProps={{
                                    startAdornment: <Calendar size={20} color="currentColor" style={{ marginRight: 8 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Filtrar por ID de Empleado"
                                value={employeeIdFilter}
                                onChange={(e) => setEmployeeIdFilter(e.target.value)}
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-root': {
                                        color: 'text.primary',
                                        bgcolor: 'background.paper',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                    },
                                }}
                                InputProps={{
                                    startAdornment: <User size={20} color="currentColor" style={{ marginRight: 8 }} />,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                startIcon={isDownloading ? <CircularProgress size={20} /> : <Download />}
                                fullWidth
                                sx={{ height: '100%' }}
                                onClick={downloadExcel}
                                disabled={isDownloading}
                            >
                                {isDownloading ? 'Generando Excel...' : 'Descargar Reporte'}
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                PaperProps={{
                                    sx: {
                                        bgcolor: 'background.paper',
                                        color: 'text.primary',
                                    }
                                }}
                            >
                                <MenuItem onClick={downloadPDF}>
                                    <FileText size={16} style={{ marginRight: 8 }} />
                                    PDF
                                </MenuItem>
                                <MenuItem onClick={downloadExcel}>
                                    <FileSpreadsheet size={16} style={{ marginRight: 8 }} />
                                    Excel
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>

                    {isLoadingData ? (
                        <Typography>Cargando datos...</Typography>
                    ) : (
                        isMobile ? renderMobileView() : renderDesktopView()
                    )}
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default WeeklyReport;