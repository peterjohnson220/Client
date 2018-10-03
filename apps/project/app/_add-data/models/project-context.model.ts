export interface ProjectContext {
  ProjectId: number;
  JobListIds: string[];
  RestrictToCountryCode: boolean;
}

export function generateProjectContext(): ProjectContext {
  return {
    ProjectId: 1234,
    JobListIds: ['1', 'A123'],
    RestrictToCountryCode : false
  };
}
