import { RoundRangesRequest } from './round-ranges-request.model';

export interface RevertRangeChangesRequest {
  RangeId: number;
  RangeGroupId: number;
  Rounding: RoundRangesRequest;
}
