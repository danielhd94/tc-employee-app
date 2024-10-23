import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  IconButton
} from '@mui/material';
import { Download } from 'lucide-react';

pdfMake.vfs = pdfFonts.pdfMake.vfs;



const EmployeeReportPDF = ({ employee, hours, reportDates }) => {

  const calculateTotalHours = (reportDate) => {
    let total = 0;
    Object.values(hours || {}).forEach(day => {
      const workHours = day.exitTime && day.entryTime ?
        (new Date(`2000-01-01T${day.exitTime}`) - new Date(`2000-01-01T${day.entryTime}`)) / 3600000 : 0;
      total += workHours + (day.overtimeHours || 0) + (day.sickLeaveHours || 0) +
        (day.vacationHours || 0) + (day.holidayHours || 0) + (day.otherHours || 0);
    });
    return total.toFixed(2);
  };
  const calculateTotalHoursDay = (day) => {
    let total = 0;
    const hoursData = Object.values(hours || {}).filter(item => item.date === day);


    hoursData.forEach(day => {
      const workHours = day.exitTime && day.entryTime ?
        (new Date(`2000-01-01T${day.exitTime}`) - new Date(`2000-01-01T${day.entryTime}`)) / 3600000 : 0;
      total += workHours + (day.overtimeHours || 0) + (day.sickLeaveHours || 0) +
        (day.vacationHours || 0) + (day.holidayHours || 0) + (day.otherHours || 0);
    });
    return total.toFixed(2);
  };

  const generatePDF = () => {
    if (!reportDates || reportDates.length === 0) {
      console.error("No report dates provided");
      return; // Detener la ejecución si no hay fechas
    }

    const {
      id: employeeId,
      employeeCode,
      name: employeeName,
    } = employee;

    const employeeHours = Array.isArray(hours) ? hours : [];

    const body = [
      [
        { text: "Fecha", style: "tableHeader" },
        { text: "Hora de Inicio", style: "tableHeader" },
        { text: "Hora de Finalización", style: "tableHeader" },
        { text: "Horas Extra", style: "tableHeader" },
        { text: "Enfermedad", style: "tableHeader" },
        { text: "Vacaciones", style: "tableHeader" },
        { text: "Días Festivos", style: "tableHeader" },
        { text: "Otro", style: "tableHeader" },
        { text: "Total de Horas", style: "tableHeader" },
      ],
    ];

    reportDates.forEach(reportDate => {
      const filteredHours = employeeHours.filter(hour => hour.date === reportDate);
      const employeeHoursForDate = filteredHours.length > 0 ? filteredHours[0] : {};

      const entryTime = employeeHoursForDate.entryTime || "N/A";
      const exitTime = employeeHoursForDate.exitTime || "N/A";
      const overtimeHours = employeeHoursForDate.overtimeHours || 0;
      const sickLeaveHours = employeeHoursForDate.sickLeaveHours || 0;
      const vacationHours = employeeHoursForDate.vacationHours || 0;
      const holidayHours = employeeHoursForDate.holidayHours || 0;
      const otherHours = employeeHoursForDate.otherHours || 0;
      const totalHours = calculateTotalHoursDay(reportDate) || 0;

      body.push([
        reportDate,
        entryTime,
        exitTime,
        overtimeHours,
        sickLeaveHours,
        vacationHours,
        holidayHours,
        otherHours,
        totalHours,
      ]);
    });

    const docDefinition = {
      pageSize: 'letter',
      pageOrientation: 'landscape',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: `TU CASA RESTAURANT LLC`,
          style: 'title',
          margin: [0, 0, 0, 10]
        },
        { text: `Reporte de Horario de Trabajo`, style: 'header', margin: [0, 0, 0, 20] },
        {
          columns: [
            { text: `Semana de: ${reportDates[0]}`, style: 'subheader' },
            { text: `Nombre del Empleado: ${employeeName}`, style: 'subheader', alignment: 'center' },
            { text: `ID de Empleado: ${employeeCode}`, style: 'subheader', alignment: 'right' },
          ],
          columnGap: 10
        },
        {
          table: {
            headerRows: 1,
            widths: [100, 70, 70, 70, 70, 70, 70, 70, 70],
            body: body,
            dontBreakRows: true,
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? '#2c3e50' : (rowIndex % 2 === 0 ? '#ecf0f1' : null);
            },
            hLineColor: function () {
              return '#bdc3c7';
            },
            vLineColor: function () {
              return '#bdc3c7';
            },
            hLineWidth: function () {
              return 1;
            },
            vLineWidth: function () {
              return 1;
            }
          }
        },
        {
          columns: [
            { text: 'Firma del Empleado', alignment: 'center', margin: [0, 30, 0, 0], decoration: 'underline' },
            { text: 'Firma del Supervisor', alignment: 'center', margin: [0, 30, 0, 0], decoration: 'underline' }
          ],
          columnGap: 30
        }
      ],
      styles: {
        title: {
          fontSize: 20,
          bold: true,
          alignment: 'center',
          color: '#2980b9',
          decoration: 'underline',
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          color: '#34495e',
          marginBottom: 20,
        },
        subheader: {
          fontSize: 12,
          bold: true,
          color: '#2c3e50',
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#2980b9',
          alignment: 'center',
          margin: [0, 5, 0, 5],
        },
        tableBody: {
          fontSize: 10,
          margin: [0, 5, 0, 5],
        },
      },
      defaultStyle: {
        font: 'Roboto',
      },
    };

    pdfMake.createPdf(docDefinition).download(`employee_report_${reportDates[0]}.pdf`);

  };

  return (
    <IconButton
      onClick={generatePDF}
      sx={{
        height: 40,        // Ajuste de la altura
        width: 40,         // Ajuste del ancho
        color: 'primary.main', // Cambia el color del ícono si lo deseas
      }}
    >
      <Download />
    </IconButton>
  );
};

export default EmployeeReportPDF;
