import { AdjustMidpointTypes } from '../../constants/structures/adjust-midpoint-type';

export interface AdjustMidpointSettingForm {
  Type: AdjustMidpointTypes;
  Percentage: number;
}

export function generateMockAdjustMidpointSetting(): AdjustMidpointSettingForm {
  return {
    Type: AdjustMidpointTypes.MoveBy,
    Percentage: 20
  };
}
