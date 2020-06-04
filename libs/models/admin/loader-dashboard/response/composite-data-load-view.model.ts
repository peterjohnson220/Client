import {EntityLoadSummaryView} from './entity-load-summary-view.model';

export interface CompositeDataLoadViewResponse {
  CompositeDataLoadId: number;
  ExternalId: string;
  CompositeLoaderType: string;
  Company_ID: number;
  Company_Name: string;
  ValidationErrorOutputUri: string;
  FixableDataConditionException: string;
  TerminalException: string;
  entityLoadSummaries: EntityLoadSummaryView[];
  RequestTime?: Date;
  ProcessingStartTime?: Date;
  ProcessingEndTime?: Date;
}
