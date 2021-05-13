export interface AutoGradeJobsModelResponse {
  CompanyJobIdsInMultipleGrades: number[];
  CompanyJobStructureGradesMapDtos: CompanyJobStructureGradesMapDtos[];
}

interface CompanyJobStructureGradesMapDtos {
  CompanyJobId: number;
  CompanyStructuresGradesId: number;
}
