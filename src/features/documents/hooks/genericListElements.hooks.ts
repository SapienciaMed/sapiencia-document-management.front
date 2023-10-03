import { useState, useEffect } from "react";

interface Elemento {
	lge_agrupador: string;
	lge_elemento_descripcion: string;
	lge_elemento_codigo: string | number;
	lge_campos_adicionales: Record<string, any>;
}

/**
 * Ej: const resultado = useElementoBuscado(data, agrupador, codigo);
 * @param data
 * @param agrupador
 * @param codigo campo opcional
 * @returns
 */
const useElementoBuscado = (
	data: Elemento[],
	agrupador: string,
	codigo?: string | number
): Elemento | null => {
	const [resultado, setResultado] = useState<Elemento | null>(null);

	useEffect(() => {
		const buscarElemento = () => {
			const elemento = data.find(
				(item) =>
					item.lge_agrupador === agrupador &&
					item.lge_elemento_codigo === codigo
			);
			setResultado(elemento || null);
		};

		buscarElemento();
	}, [data, agrupador, codigo]);

	return resultado;
};

export default useElementoBuscado;
