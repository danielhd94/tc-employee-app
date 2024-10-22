import { useState, useEffect } from "react";
import { createTime, fetchTimes } from "../api/timeApi";

export const useTime = (storageKey: string, shouldFetch: boolean = true) => {
  const [timeData, setTimeData] = useState<any>({});
  const [isLoadingTimeData, setIsLoadingTimeData] = useState(true);

  useEffect(() => {
    const fetchTimeData = async () => {
      setIsLoadingTimeData(true);
      try {
        const cachedTimeData = localStorage.getItem(storageKey);
        if (cachedTimeData && shouldFetch === false) {
          setTimeData(JSON.parse(cachedTimeData));
        } else {
          const response = await fetchTimes();
          if (response.success) {
            const transformedData = transformResponse(response.data);
            setTimeData(transformedData);
            localStorage.setItem(storageKey, JSON.stringify(transformedData));
          } else {
            console.error(`Failed to fetch time data: ${response.message}`);
          }
        }
      } catch (error) {
        console.error(`An error occurred while fetching time data: ${error}`);
      } finally {
        setIsLoadingTimeData(false);
      }
    };

    if (shouldFetch) {
      fetchTimeData();
    }
  }, [storageKey, shouldFetch]);

  // Función para agregar un nuevo registro de tiempo a través de la API y actualizar el estado
  const addTimeData = async (time) => {
    try {
      const response = await createTime(time);
      if (response.success) {
        // Extrae los nuevos datos del tiempo creado
        const newTimeEntry = response.data;

        // Actualiza el estado con el nuevo registro de tiempo
        setTimeData((prevTimeData) => {
          const updatedTimeData = { ...prevTimeData };
          const date = newTimeEntry.date.split("T")[0]; // Formato YYYY-MM-DD
          const employeeId = newTimeEntry.employeeId;

          // Inicializa la fecha en el objeto result si no existe
          if (!updatedTimeData[date]) {
            updatedTimeData[date] = {};
          }

          // Inicializa el empleado en la fecha si no existe
          if (!updatedTimeData[date][employeeId]) {
            updatedTimeData[date][employeeId] = {
              entryTime: null,
              exitTime: null,
              overtimeHours: null,
              sickLeaveHours: null,
              vacationHours: null,
              holidayHours: null,
              otherHours: null,
            };
          }

          // Asigna los valores de entrada y salida
          if (newTimeEntry.entryTime) {
            updatedTimeData[date][employeeId].entryTime = newTimeEntry.entryTime
              .split("T")[1]
              .slice(0, 5); // Extrae HH:mm
          }
          if (newTimeEntry.exitTime) {
            updatedTimeData[date][employeeId].exitTime = newTimeEntry.exitTime
              .split("T")[1]
              .slice(0, 5); // Extrae HH:mm
          }

          // Asigna horas adicionales si existen
          if (newTimeEntry.overtimeHours) {
            updatedTimeData[date][employeeId].overtimeHours =
              newTimeEntry.overtimeHours;
          }
          if (newTimeEntry.sickLeaveHours) {
            updatedTimeData[date][employeeId].sickLeaveHours =
              newTimeEntry.sickLeaveHours;
          }
          if (newTimeEntry.vacationHours) {
            updatedTimeData[date][employeeId].vacationHours =
              newTimeEntry.vacationHours;
          }
          if (newTimeEntry.holidayHours) {
            updatedTimeData[date][employeeId].holidayHours =
              newTimeEntry.holidayHours;
          }
          if (newTimeEntry.otherHours) {
            updatedTimeData[date][employeeId].otherHours =
              newTimeEntry.otherHours;
          }

          // Guarda los datos actualizados en el localStorage
          localStorage.setItem(storageKey, JSON.stringify(updatedTimeData));

          return updatedTimeData;
        });
      } else {
        console.error(`Failed to create time entry: ${response.message}`);
      }
    } catch (error) {
      console.error(`An error occurred while adding time data: ${error}`);
    }
  };

  // Función para transformar la respuesta
  const transformResponse = (data) => {
    const result = {};

    if (Array.isArray(data)) {
      data.forEach((item) => {
        const date = item.date.split("T")[0]; // Formato YYYY-MM-DD
        const employeeId = item.employeeId;

        // Inicializa la fecha en el objeto result si no existe
        if (!result[date]) {
          result[date] = {};
        }

        // Inicializa el empleado en la fecha si no existe
        if (!result[date][employeeId]) {
          result[date][employeeId] = {
            entryTime: null,
            exitTime: null,
            overtimeHours: null,
            sickLeaveHours: null,
            vacationHours: null,
            holidayHours: null,
            otherHours: null,
          };
        }

        // Asigna los valores de entrada y salida
        if (item.entryTime) {
          result[date][employeeId].entryTime = item.entryTime
            .split("T")[1]
            .slice(0, 5); // Extrae HH:mm
        }
        if (item.exitTime) {
          result[date][employeeId].exitTime = item.exitTime
            .split("T")[1]
            .slice(0, 5); // Extrae HH:mm
        }

        // Asigna horas adicionales si existen
        if (item.overtimeHours) {
          result[date][employeeId].overtimeHours = item.overtimeHours;
        }
        if (item.sickLeaveHours) {
          result[date][employeeId].sickLeaveHours = item.sickLeaveHours;
        }
        if (item.vacationHours) {
          result[date][employeeId].vacationHours = item.vacationHours;
        }
        if (item.holidayHours) {
          result[date][employeeId].holidayHours = item.holidayHours;
        }
        if (item.otherHours) {
          result[date][employeeId].otherHours = item.otherHours;
        }
      });
    } else {
      console.error("La respuesta de la API no contiene datos válidos.");
    }

    return result;
  };

  return { timeData, isLoadingTimeData, addTimeData, setTimeData };
};
