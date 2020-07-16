import {EntityLoadSummaryView} from './entity-load-summary-view.model';

export interface CompositeDataLoadViewResponse {
  compositeDataLoadId: number;
  externalId: string;
  compositeLoaderType: string;
  company_ID: number;
  company_Name: string;
  validationErrorOutputUri: string;
  fixableDataConditionException: string;
  terminalException: string;
  loadType?: string;
  validationOnly?: boolean;
  entityLoadSummaries: EntityLoadSummaryView[];
  requestTime?: Date;
  processingStartTime?: Date;
  processingEndTime?: Date;
}
