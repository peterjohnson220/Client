import { RoundRangesRequest } from './round-ranges-request.model';

export interface RecalcAndSaveRangeMinMaxRequest {
  RangeGroupId: number;
  RangeId: number;
  FieldValue: number;
  FieldName: string;
  IsMid: boolean;
  RowIndex: number;
  Rounding: RoundRangesRequest;
}
