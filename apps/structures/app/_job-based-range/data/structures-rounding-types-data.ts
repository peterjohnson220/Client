import { RoundingType } from '../shared/models/rounding-type.model';

import { RoundingTypes } from 'libs/constants/structures/rounding-type';


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
