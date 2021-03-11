import { RoundingTypes } from 'libs/constants/structures/rounding-type';

import { RoundingType } from '../models';

export const StructuresRoundingTypes: RoundingType[] = [
  {
    TypeDisplay: 'Round',
    Type: RoundingTypes.Round
  },
  {
    TypeDisplay: 'Up',
    Type: RoundingTypes.RoundUp
  },
  {
    TypeDisplay: 'Down',
    Type: RoundingTypes.RoundDown
  }
];
