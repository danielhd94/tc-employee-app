import * as React from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { fetchEmployees, fetchGenderData, createEmployee } from './api/employeeApi';
import { createDepartment } from './api/departmentApi';

export default function Home() {
    const [departmentData, setDepartmentData] = React.useState([]);
    const [genderData, setGenderData] = React.useState([]);

    React.useEffect(() => {
        getDepartmentData();
        getGenderData();
    }, []);

    const getDepartmentData = async () => {
        try {
            // Fetch data from external source using the provided function
            const response = await fetchEmployees();
            const { data } = response;

            // Calcular el total de empleados por departamento
            const departmentCounts = {};
            data.forEach(employee => {
                if (departmentCounts[employee.department.departmenName]) {
                    departmentCounts[employee.department.departmentName] += 1;
                } else {
                    departmentCounts[employee.department.departmentName] = 1;
                }
            });

            // Convertir datos para el gráfico de pastel
            const pieChartData = Object.keys(departmentCounts).map(department => ({
                id: department,
                value: departmentCounts[department],
                label: department,
            }));

            // Actualizar el estado con los datos para el gráfico
            setDepartmentData(pieChartData);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getGenderData = async () => {
        try {
            // Obtén datos de género
            const genderResponse = await fetchGenderData();
            const genderData = genderResponse.data;

            // Actualiza el estado con los datos de género
            setGenderData(genderData);
        } catch (error) {
            console.error('Error fetching gender data: ', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper>
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
                                height={200}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper>
                            <BarChart width={600} height={400} data={genderData}>
                                <text x={300} y={30} textAnchor="middle" fontSize="24px" fill="#333">
                                    Employees by gender
                                </text>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="genderName" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="employeeCount" fill="#8884d8" />
                            </BarChart>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
