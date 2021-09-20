import { AsyncStateObj } from '../../../models';

export interface ExportOptions {
  Display: string;
  Name: string;
  Description: string;
  Endpoint: string;
  ValidExtensions: string[];
  Custom: boolean;
  Exporting:  AsyncStateObj<boolean>;
  ExportedReportExtension: string;
  RequiresSelection?: boolean;
}
