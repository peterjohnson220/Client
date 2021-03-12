export interface GradeJob {
  JobCode: string;
  JobTitle: string;
  CompanyStructuresGradesId: number;
}

export function generateMockGradeJob(): GradeJob {
  return {
    JobTitle: 'Fake Job',
    JobCode: 'AAA',
    CompanyStructuresGradesId: 1
  };
}
