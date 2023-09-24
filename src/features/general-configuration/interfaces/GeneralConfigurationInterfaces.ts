export interface IConsecutiveNumberForm {
  anexo?: number;
  letter?: number;
  expedient?: number;
  external?: number;
  internal?: number;
  radiable_number?: number;
  filed_number_exped?: number;
  received?: number;
  series?: number;
  inventory_record?: number;
  inventory_record_detail?: number;
}


export interface IGeneralConfiguration {
  email_alarm?: boolean;
  cause_of_return_x_condition?: number;
  compress_image?: boolean;
  route_creator_path?: string;
  pdf_temporary_path?: string;
  start_without_image_internal?: boolean;
  business_days?: boolean;
  admin_email?: boolean;
  ip_range?: boolean;
  anexo?: number;
  letter?: number;
  expedient?: number;
  external?: number;
  internal?: number;
  radiable_number?: number;
  filed_number_exped?: number;
  received?: number;
  series?: number;
  inventory_record?: number;
  inventory_record_detail?: number;
  temporary_filing_rules?: boolean;
  temporary_filing?: boolean;
}

export interface IGeneralConfigurationTemp { 
}