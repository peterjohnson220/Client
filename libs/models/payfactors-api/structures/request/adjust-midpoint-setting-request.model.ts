import { AdjustMidpointTypes } from '../../../../constants/structures/adjust-midpoint-type';

export interface AdjustMidpointSettingRequest {
  Type: AdjustMidpointTypes;
  Percentage: number;
}

