import { useState } from 'react';
import { toast } from 'react-toastify';
import { createEmployee, updateEmployee } from '../api/employeeApi';

export const useEmployeeForm = (employees, setEmployees, isEditMode, employeeData) => {
    const [employee, setEmployee] = useState({
        employeeId: employeeData?.employeeId ?? null,
        employeeCode: employeeData?.employeeCode ?? '',
        employeeName: employeeData?.employeeName ?? '',
        department: employeeData?.department ?? '',
        dateOfJoining: employeeData?.dateOfJoining ?? '',
        photoFileName: employeeData?.photoFileName ?? 'anonymous.png',
        gender: employeeData?.gender ?? '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field, value) => {
        setEmployee(prev => ({ ...prev, [field]: value }));
    };

    const createParameter = (data) => ({
        ...data,
        department: { departmentId: data.department },
        gender: { genderId: data.gender },
    });

    const updateEmployeeList = (data, response) => {
        return isEditMode
            ? employees.map(emp => emp.employeeId === data.employeeId ? { ...emp, ...response.data } : emp)
            : [...employees, response.data];
    };

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const parameter = createParameter(data);
            const response = isEditMode
                ? await updateEmployee(parameter)
                : await createEmployee(parameter);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            const updatedEmployees = updateEmployeeList(data, response);
            setEmployees(updatedEmployees);
            localStorage.setItem('employeeData', JSON.stringify(updatedEmployees));
            toast.success(response.message);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'An error occurred while processing the request.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false); // Reiniciar el estado de envío
        }
    };

    return { employee, setEmployee, handleSubmit, handleInputChange, isSubmitting };
};
