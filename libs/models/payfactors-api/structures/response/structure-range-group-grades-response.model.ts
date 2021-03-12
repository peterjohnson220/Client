export interface StructureRangeGroupGradesResponse {
  CompanyStructuresRanges_ID: number;
  Grade_Name: string;
  Min: number;
  Mid: number;
  Max: number;
  Tertile_First?: number;
  Tertile_Second?: number;
  Quartile_First?: number;
  Quartile_Second?: number;
  Quintile_First?: number;
  Quintile_Second?: number;
  Quintile_Third?: number;
  Quintile_Fourth?: number;
  CompanyStructuresGrades_ID: number;
  NumJobs: number;
}
