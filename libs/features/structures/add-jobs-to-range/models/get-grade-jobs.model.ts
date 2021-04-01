
export interface GetGradeJobsModel {
  CompanyStructuresRangeGroupId: number;
  CompanyStructuresGradesId: number;
  ControlPoint: string;
}

export function generateMockGetGradeJobsModel(): GetGradeJobsModel {
  return {
    CompanyStructuresRangeGroupId: 1,
    CompanyStructuresGradesId: 1,
    ControlPoint: 'BaseMRP'
  };
}
