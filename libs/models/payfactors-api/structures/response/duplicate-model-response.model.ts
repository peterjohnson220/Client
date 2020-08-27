import { StructureRangeGroupResponse } from './structure-range-group-response.model';

export interface DuplicateModelResponse {
  ValidationResult: DupicateModelValidationResult;
  RangeGroup: StructureRangeGroupResponse;
}

interface DupicateModelValidationResult {
  Pass: boolean;
  FailureReason: string;
}
