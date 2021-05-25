import { EntityLoadSummaryView } from './entity-load-summary-view.model';
import { EntityLoadSummaryDetailView } from './entity-load-summary-detail-view.model';

export interface CompositeDataLoadViewResponse {
  compositeDataLoadId: number;
  exportedSourceUri: string;
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
  entityLoadSummaryDetails: EntityLoadSummaryDetailView[];
  requestTime?: Date;
  processingStartTime?: Date;
  processingEndTime?: Date;
  hasErrorCondition?: boolean;
}
