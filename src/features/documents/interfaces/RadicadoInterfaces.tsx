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

interface IRecipientExternalDataForm {
	dirigido_a: string;
	nombres_apellidos: string;
	pais: string;
	departamento: string;
	municipio: string;
}

interface IMovementsDataForm {
	dra_radicado: string;
}

interface IModalActivateReverse {
	dra_radicado: string | number;
	dra_tipo_radicado: string | number;
	dra_destinatario: string | number | null;
	dra_radicado_por: string | number;
	comentario: string;
	dra_estado_radicado: string | number;
	typeModal: string;
	dra_usuario: string | number;
}

interface ISenderSearchForm {
	doc_identidad: string;
	entidad: string;
	abreviatura: string;
}

interface IRelatedAnswerForm {
	dra_radicado: string;
	dra_tipo_radicado: string;
}

interface IAnswerDocumentForm {
	dra_radicado: string;
	dra_tipo_radicado: string;
	dra_tipo_radicado_text?: string;
}

interface ISenderCreateForm {
	ent_tipo_documento: string;
	ent_numero_identidad: string;
	ent_nombres: string;
	ent_apellidos: string;
	ent_razon_social: string;
	ent_tipo_entidad: number;
	ent_abreviatura: string;
	ent_direccion: string;
	ent_email: string;
	ent_contacto_uno: number;
	ent_contacto_dos: number;
	ent_observaciones: string;
	ent_pais: string;
	ent_departamento: number;
	ent_municipio: number;
	ent_estado: boolean;
}

interface IBasicDocumentInformationForm {
	codigo_asunto: string;
	nombre_asunto: string;
	tiempo_respuesta: number;
	unidad: string;
	tipo: number;
	prioridad: string;
	search_codigo_asunto?: string;
	search_nombre_asunto?: string;
}

interface IRecipientDataForm {
	dirigido_a: string;
	nombres_apellidos_destinatario: string;
	pais_destinatario: string;
	departamento_destinatario: string;
	municipio_destinatario: string;
	search_codigo_usuario: number;
	search_nombre_usuario: string;
	search_apellido_usuario: string;
}

interface ISubjectForm {
	referencia: string;
	tipo_asunto: string;
}

interface IOptionalFieldsForm {
	observaciones: string;
	numero_anexos: number;
	numero_folios: number;
	numero_cajas: number;
}

interface ICommentsById {
	radicado: string;
	title: string;
	onCloseModal: () => void;
	visible: boolean;
	//dataForModal: any;
}
