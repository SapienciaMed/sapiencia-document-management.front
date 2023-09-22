interface IDocumentInformationForm {
	codigo_asunto: number;
	nombres_asunto: string;
	tiempo_respuesta: number;
	Unidad: string;
	tipo: string;
	nombres_apellidos: string;
}

interface IRadicadoDetailsForm {
	radicado: number;
	fecha_radicado: string;
	radicado_origen: string;
	fecha_origen: string;
	radicado_por: string;
	nombres_apellidos: string;
}

interface ISenderDataForm {
	enviado_por: string;
	nombres_apellidos: string;
	pais: string;
	departamento: string;
	municipio: string;
}

interface IBasicDocumentInformationForm {
	codigo_asunto: string;
	nombre_asunto: string;
	tiempo_respuesta: number;
	unidad: string;
	tipo: string;
	prioridad: string;
}

interface IRecipientDataForm {
	dirigido_a: string;
	nombres_apellidos_destinatario: string;
	pais_destinatario: string;
	departamento_destinatario: string;
	municipio_destinatario: string;
}

interface ISubjectForm {
	referencia: string;
	tipo: string;
}

interface IOptionalFieldsForm {
	observaciones: string;
	numero_anexos: number;
	numero_folios: number;
	numero_cajas: number;
}
