import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';

import { RoundRangesRequest } from './round-ranges-request.model';

export interface RecalcAndSaveRangeMinMaxRequest {
  RangeGroupId: number;
  RangeId: number;
  FieldValue: number;
  FieldName: string;
  RangeRecalculationType: RangeRecalculationType;
  RowIndex: number;
}
