import * as React from 'react';
import { Box, Container, Grid, Paper, Typography, useMediaQuery, Card, CardActionArea, CardContent } from '@mui/material';
import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { fetchEmployees, fetchGenderData } from './api/employeeApi';
import { useNavigate } from 'react-router-dom';

// Componente para las tarjetas de navegación
const CardNavigation = ({ item }) => {
    const navigate = useNavigate();

    return (
        <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ height: '100%' }}>
                <CardActionArea onClick={() => navigate(item.path)}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};

export default function Home() {
    const [departmentData, setDepartmentData] = React.useState([]);
    const [genderData, setGenderData] = React.useState([]);

    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

    React.useEffect(() => {
        getDepartmentData();
        getGenderData();
    }, []);

    const cardItems = [
        {
            title: 'Time Sheet',
            description: 'Gestiona el horario de los empleados',
            path: '/timesheet',
        },
        {
            title: 'Weekly Report',
            description: 'Revisa el reporte semanal',
            path: '/report',
        },
    ];

    const getDepartmentData = async () => {
        try {
            const response = await fetchEmployees();
            const { data } = response;

            const departmentCounts = {};
            data.forEach(employee => {
                const departmentName = employee.department.departmentName;
                departmentCounts[departmentName] = (departmentCounts[departmentName] || 0) + 1;
            });

            const pieChartData = Object.keys(departmentCounts).map(department => ({
                id: department,
                value: departmentCounts[department],
                label: department,
            }));

            setDepartmentData(pieChartData);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getGenderData = async () => {
        try {
            const genderResponse = await fetchGenderData();
            const genderData = genderResponse.data;
            setGenderData(genderData);
        } catch (error) {
            console.error('Error fetching gender data: ', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                {cardItems.map((item, index) => (
                    <CardNavigation key={index} item={item} />
                ))}
            </Grid>

            <Box my={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant={isSmallScreen ? "h5" : "h4"} align="center" gutterBottom>
                            Company Analytics Dashboard
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: isSmallScreen ? 2 : 3, borderRadius: 4 }}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Employees by Department
                            </Typography>
                            <PieChart
                                series={[
                                    {
                                        data: departmentData,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30 },
                                    },
                                ]}
                                sx={{
                                    [`& .${pieArcClasses.faded}`]: {
                                        fill: 'gray',
                                    },
                                }}
                                height={isSmallScreen ? 200 : 300}
                                animation
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} sx={{ padding: isSmallScreen ? 2 : 3, borderRadius: 4 }}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Employees by Gender
                            </Typography>
                            <ResponsiveContainer width="100%" height={isSmallScreen ? 200 : 400}>
                                <BarChart data={genderData} barSize={isSmallScreen ? 20 : 40}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="genderName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="employeeCount" fill="#8884d8" animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center">
                                Additional Metrics Coming Soon!
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
