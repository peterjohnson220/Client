import { StatementEmailTemplate } from 'libs/models/payfactors-api/total-rewards';

export enum DeliveryMethod {
  Email = 'Email',
  PDFExport = 'PDF'
}

export interface DeliveryOption {
  Method: DeliveryMethod;
  EmailTemplate?: StatementEmailTemplate;
  SaveEmailTemplate?: boolean;
}
