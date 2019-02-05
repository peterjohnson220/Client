export interface JobData {
  JobId: number;
  JobTitle: string;
  JobDescription: string;
  Education: string;
  YearsOfExperience: string;
  ManagesEmployees: boolean;
  Skills: string;
  Base50: number;
  Tcc50: number;
  Incs?: number;
  Orgs?: number;
}

export interface JobGridData {
  Total: number;
  Data: JobData[];
}

export function generateFakeJobData(): JobData {
  return{
    JobId: 1,
    Tcc50: 100,
    Base50: 100,
    YearsOfExperience: '6+',
    Education: 'College',
    Incs: 1,
    JobDescription: 'Spme job description',
    JobTitle: 'Job A',
    ManagesEmployees: false,
    Orgs: 2,
    Skills: 'None'
  };

}
