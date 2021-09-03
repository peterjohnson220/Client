import { StructureRangeGroupGradesResponse } from './structure-range-group-grades-response.model';

export interface AddGradeRangeResponse {
  ValidationResult: AddGradeRangeValidationResult;
  GradeRange: StructureRangeGroupGradesResponse;
}

interface AddGradeRangeValidationResult {
  Pass: boolean;
  FailureReason: string;
}
