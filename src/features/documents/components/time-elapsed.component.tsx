import React, { useState, useEffect } from "react";
import moment, { months } from "moment";

const TimeElapsed = ({ fecha }) => {
	const [months, setMonths] = useState(0);
	const [days, setDays] = useState(0);
	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);

	useEffect(() => {
		const currentDate = moment();

		// const differenceDays: any = currentDate.diff(fecha, "days");
		// const differenceHours: any = currentDate.diff(fecha, "hours");
		// const differenceMinutes: any = currentDate.diff(fecha, "minutes");

		// setDias(differenceDays);
		// setHoras(differenceHours);
		// setMinutos(differenceMinutes);
		const duration = moment.duration(currentDate.diff(fecha));

		const monthsDuration = duration.months();
		const daysDuration = duration.days();
		const hoursDuration = duration.hours();
		const minutesDuration = duration.minutes();

		setMonths(monthsDuration);
		setDays(daysDuration);
		setHours(hoursDuration);
		setMinutes(minutesDuration);
	}, [fecha]);

	return (
		<div className="flex flex-column gap-10">
			{months !== 0 && <div>Meses: {months}</div>}
			<div>Días: {days}</div>
			<div>Horas: {hours}</div>
			<div>Minutos: {minutes}</div>
		</div>
	);
};

export default TimeElapsed;
