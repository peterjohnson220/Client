import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';


export class CompareJobRangesHelper {
  static createDataFiltersForCompareRanges(rangeGroupId: any) {
    const dataFilter: DataViewFilter[] = [
      {
        EntitySourceName: 'CompanyStructures_RangeGroup',
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Values: [rangeGroupId]
      },
      {
        EntitySourceName: 'CompanyJobs',
        SourceName: 'JobStatus',
        Operator: '=',
        Values: [1]
      }
    ];
    return dataFilter;
  }
}
