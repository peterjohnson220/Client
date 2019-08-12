import {DataViewFieldDataType} from 'libs/models/payfactors-api/reports/request';

export interface Field {
  EntityId: number;
  Entity: string;
  EntitySourceName: string;
  DataElementId: number;
  SourceName: string;
  DisplayName: string;
  DataType?: DataViewFieldDataType;
  IsSelected?: boolean;
  Order?: number;
}

export function generateMockField(): Field {
  return {
    DataElementId: 1,
    EntityId: 1,
    Entity: 'Jobs',
    DataType: DataViewFieldDataType.String,
    DisplayName: 'Job Title',
    EntitySourceName: 'CompanyJobs',
    IsSelected: false,
    Order: 1,
    SourceName: 'Job_Title'
  };
}
