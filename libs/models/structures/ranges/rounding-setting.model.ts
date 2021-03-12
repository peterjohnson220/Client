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
    },
    'firstTertile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'secondTertile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'firstQuartile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'secondQuartile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'firstQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'secondQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'thirdQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    },
    'fourthQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    }
  };
}

export function generateMockRoundingSetting(): RoundingSetting {
  return {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    };
}
