import { DataViewFilter } from 'libs/models/payfactors-api';

export class JobsHelpers {

  static updateJobIdFilter(filters: DataViewFilter[], fieldName: string, targetEntityName: string): void {    
    if (filters) {
      const JobIdFilter = filters.filter(f => f.EntitySourceName === 'CompanyJobs' && f.SourceName === fieldName);

      if (JobIdFilter && JobIdFilter.length > 0) {
        JobIdFilter[0].EntitySourceName = targetEntityName;
      }
    }
  }
}
