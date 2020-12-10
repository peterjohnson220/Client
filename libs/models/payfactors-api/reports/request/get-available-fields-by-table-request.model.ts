export interface GetAvailableFieldsByTableRequest {
  Tables: AvailableTableFields[];
  CompanyId?: number;
  UserId?: number;
  PageViewId: string;
}

export interface AvailableTableFields {
   TableName: string;
   IncludedDataTypes: string[];
}
