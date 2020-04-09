export interface CompositeDataLoadViewResponse {
  CompositeDataLoadId: number;
  ExternalId: string;
  CompositeLoaderType: string;
  Company_ID: number;
  Company_Name: string;
  ValidationErrorOutputUri: string;
  FixableDataConditionException: string;
  RequestTime?: Date;
  ProcessingStartTime?: Date;
  ProcessingEndTime?: Date;
}
