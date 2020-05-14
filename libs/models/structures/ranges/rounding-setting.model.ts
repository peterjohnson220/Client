import { RoundingTypes } from 'libs/constants/structures/rounding-type';


export interface RoundingSetting {
  RoundingType: RoundingTypes;
  RoundingPoint: number;
}

interface IRoundingSettingsDataObj {
  [s: string]: RoundingSetting;
}

export abstract class RoundingSettingsDataObj implements IRoundingSettingsDataObj {
  [ s: string ]: RoundingSetting;
}

export function generateMockRoundingSettingsDataObj(): RoundingSettingsDataObj {
  return {
    'min': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'mid': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'max': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    }
  };
}
