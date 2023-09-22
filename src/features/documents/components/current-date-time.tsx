import { useState, useEffect } from "react";

function useCurrentDateTime() {
	const [currentDateTime, setCurrentDateTime] = useState<string>("");

	useEffect(() => {
		// Función para obtener la fecha y hora actual.
		const getCurrentDateTime = (): string => {
			const now = new Date();
			const options: Intl.DateTimeFormatOptions = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				// hour: "2-digit",
				// minute: "2-digit",
				// second: "2-digit",
				// hour12: false, // Utilizar formato de 24 horas
			};
			return now.toLocaleString("es-ES", options);
		};

		// Actualizar el estado con la fecha y hora actual.
		// const updateDateTime = () => {
		// 	const dateTime = getCurrentDateTime();
		// 	setCurrentDateTime(dateTime);
		// };

		// Actualizar cada segundo para mostrar una hora en tiempo real.
		//const intervalId = setInterval(updateDateTime, 1000);

		// Limpieza del intervalo cuando el componente se desmonta.
		//return () => clearInterval(intervalId);

		// Obtener la fecha y hora actual al cargar el componente.
		//Comentar estas dos lineas y descomentar las anteriores si se necesita la hora en tiempo real
		const dateTime = getCurrentDateTime();
		setCurrentDateTime(dateTime);
	}, []);

	return currentDateTime;
}

export default useCurrentDateTime;
