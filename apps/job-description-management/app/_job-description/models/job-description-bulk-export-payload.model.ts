import { AvailableJobInformationField, ControlLabel } from '../../shared/models';
import { ListState } from './list-state.model';


export interface JobDescriptionBulkExportPayload {
  Query: string;
  ViewName: string;
  IncludeHtmlFormatting: boolean;
  Controls: ControlLabel[];
  ListState: ListState;
  AvailableJobInformationFields: AvailableJobInformationField[];
  Statuses: string[];
}
