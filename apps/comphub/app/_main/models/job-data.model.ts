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
