import React, { useState, useEffect } from "react";
import moment from "moment";

/**
 * Uso: const fecha = moment("2023-07-20");
 * const { dias, horas, minutos } = useTiempoTranscurrido(fecha);
 * @param fecha
 * @returns
 */
const useTimeElapsed = (fecha) => {
	const [dias, setDias] = useState(0);
	const [horas, setHoras] = useState(0);
	const [minutos, setMinutos] = useState(0);

	useEffect(() => {
		const ahora = moment();
		const diferencia: any = ahora.diff(fecha);

		setDias(diferencia.days);
		setHoras(diferencia.hours);
		setMinutos(diferencia.minutes);
	}, [fecha]);

	return {
		dias,
		horas,
		minutos,
	};
};

export default useTimeElapsed;
