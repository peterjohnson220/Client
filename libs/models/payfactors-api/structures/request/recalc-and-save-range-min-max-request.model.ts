import { RoundRangesRequest } from './round-ranges-request.model';

export interface RecalcAndSaveRangeMinMaxRequest {
  RangeGroupId: number;
  RangeId: number;
  Mid: number;
  RowIndex: number;
  Rounding: RoundRangesRequest;
}
