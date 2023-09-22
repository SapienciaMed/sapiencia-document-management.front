import * as yup from "yup";


const validations = {
    consecutiveNumberForm: {
        anexo: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        letter: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        expedient: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        external: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        internal: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        radiable_number: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        filed_number_exped: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        received: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        series: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        inventory_record: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        inventory_record_detail: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
    }
}
export const consecutiveNumberValidator = yup.object({ ...validations.consecutiveNumberForm });

export const generalConfigurationValidator = yup.object({ ...validations.consecutiveNumberForm });