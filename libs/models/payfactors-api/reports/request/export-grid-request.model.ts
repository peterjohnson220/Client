import { DataView} from './data-views-generic.model';

export interface ExportGridRequest {
  DataView: DataView;
  Source: string;
  CustomExportType: string;
}
