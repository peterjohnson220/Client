
export interface GetAddGradeJobsModel {
  CompanyStructuresRangeGroupId: number;
  CompanyStructuresGradesId: number;
  ControlPoint: string;
  JobIds: number[];
}

export function generateMockGetAddGradeJobsModel(): GetAddGradeJobsModel {
  return {
    CompanyStructuresRangeGroupId: 1,
    CompanyStructuresGradesId: 1,
    ControlPoint: 'BaseMRP',
    JobIds: []
  };
}
