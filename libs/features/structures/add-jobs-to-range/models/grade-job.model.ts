export interface GradeJob {
  JobCode: string;
  JobTitle: string;
  JobId: number;
  CompanyStructuresGradesId: number;
  AlreadyExists: boolean;
}

export function generateMockGradeJob(): GradeJob {
  return {
    JobTitle: 'Fake Job',
    JobCode: 'AAA',
    CompanyStructuresGradesId: 1,
    JobId: 1,
    AlreadyExists: true
  };
}
