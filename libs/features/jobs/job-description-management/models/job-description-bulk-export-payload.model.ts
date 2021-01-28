import { AvailableJobInformationField, ControlLabel, ListState } from './index';

export interface JobDescriptionBulkExportPayload {
  Query: string;
  ViewName: string;
  IncludeHtmlFormatting: boolean;
  Controls: ControlLabel[];
  ListState: ListState;
  AvailableJobInformationFields: AvailableJobInformationField[];
  Statuses: string[];
}
