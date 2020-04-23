import { RoundingTypes } from 'libs/constants/structures/rounding-type';

export interface RoundRangesRequest {
  MinRoundingType: RoundingTypes;
  MidRoundingType: RoundingTypes;
  MaxRoundingType: RoundingTypes;
  MinRoundingPoint: number;
  MidRoundingPoint: number;
  MaxRoundingPoint: number;
}
