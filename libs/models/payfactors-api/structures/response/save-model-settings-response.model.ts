import { StructureRangeGroupResponse } from './structure-range-group-response.model';

export interface SaveModelSettingsResponse {
  ValidationResult: SaveModelSettingsValidationResult;
  RangeGroup: StructureRangeGroupResponse;
}

interface SaveModelSettingsValidationResult {
  Pass: boolean;
  FailureReason: string;
}
