export interface UserDataView {
  UserDataViewId: number;
  BaseEntityId: number;
  Entity: string;
  Name: string;
  Summary: string;
  SortField: string;
  SortDir: 'desc' | 'asc';
}

export function generateMockUserDataView(): UserDataView {
  return {
    UserDataViewId: 1,
    BaseEntityId: 1,
    Entity: 'Jobs',
    Name: 'Jobs Report',
    Summary: 'Job summary',
    SortField: 'CompanyJobs_Job_Title',
    SortDir: 'asc'
  };
}
