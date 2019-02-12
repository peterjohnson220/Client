export interface JobData {
  JobId: number;
  JobTitle: string;
  JobDescription: string;
  Education: string;
  YearsOfExperience: string;
  ManagesEmployees: boolean;
  Skills: string[];
  Base25?: number;
  Base50?: number;
  Base75?: number;
  Tcc25?: number;
  Tcc50?: number;
  Tcc75?: number;
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
    Tcc50: 100000,
    Base50: 100000,
    YearsOfExperience: '6+',
    Education: 'College',
    Incs: 1,
    JobDescription: 'Some job description',
    JobTitle: 'Job A',
    ManagesEmployees: false,
    Orgs: 2,
    Skills: ['Leadership', 'Analytical skills', 'Problem-solving', 'Ability to work within a team.']
  };

}
