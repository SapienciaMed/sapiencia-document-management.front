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
    },
    notificationsForm: {
        admin_email: yup.string().email('Correo incorrecto').required("El campo es obligatorio"),

    },
    pdfProcessFormValidator: {
        route_creator_path: yup.string().required("El campo es obligatorio"),
        pdf_temporary_path: yup.string().required("El campo es obligatorio"),

    },
    standarTypeFormValidator: {
        cause_of_return_x_condition: yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
    },
    workingHoursFormValidator: {
        lunch_duration:  yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        time:  yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
        lunch_time:  yup.number().transform((value) => Number.isNaN(value) ? null : value ).required("El campo es obligatorio"),
    }
}

export const consecutiveNumberValidator = yup.object({ ...validations.consecutiveNumberForm });
export const notificationsValidator = yup.object({ ...validations.notificationsForm });
export const pdfProcessFormValidator = yup.object({ ...validations.pdfProcessFormValidator });
export const standarTypeFormValidator = yup.object({ ...validations.standarTypeFormValidator });
export const workingHoursFormValidator = yup.object({ ...validations.workingHoursFormValidator });

export const generalConfigurationValidator = yup.object({
    ...validations.consecutiveNumberForm, ...validations.notificationsForm,
    ...validations.pdfProcessFormValidator, ...validations.standarTypeFormValidator,
    ...validations.workingHoursFormValidator,
});