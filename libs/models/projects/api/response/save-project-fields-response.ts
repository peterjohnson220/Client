import { DataViewConfig } from '../../../payfactors-api';

// TODO: Strongly type the project in the projects page state
export interface SaveProjectFieldsResponse {
  ViewConfiguration: DataViewConfig;
  Project: any;
}
