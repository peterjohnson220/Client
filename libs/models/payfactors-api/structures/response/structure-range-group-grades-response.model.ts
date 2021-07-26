export interface StructureRangeGroupGradesResponse {
  CompanyStructuresRangesId: number;
  GradeName: string;
  Min: number;
  Mid: number;
  Max: number;
  TertileFirst?: number;
  TertileSecond?: number;
  QuartileFirst?: number;
  QuartileSecond?: number;
  QuintileFirst?: number;
  QuintileSecond?: number;
  QuintileThird?: number;
  QuintileFourth?: number;
  CompanyStructuresGradesId: number;
  NumJobs: number;
  AssignedJobIds: number[];
}
