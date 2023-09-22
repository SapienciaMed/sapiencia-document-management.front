import { useState, useEffect } from "react";

const useFetchData = (url: string, id: string | number) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const response = await fetch(`${url}/${id}`);
			const json = await response.json();
			setData(json);
			setLoading(false);
		};
		fetchData();
	}, [id]);

	return {
		data,
		loading,
	};
};
