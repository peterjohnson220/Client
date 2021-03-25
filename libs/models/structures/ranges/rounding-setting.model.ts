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

export function generateMockRoundingSettingsDataObj(rate?): RoundingSettingsDataObj {
  let point = 0;
  if (rate) {
    point = rate === 'Hourly' ? 2 : 0;
  }
  return {
    'min': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'mid': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'max': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'firstTertile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'secondTertile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'firstQuartile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'secondQuartile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'firstQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'secondQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'thirdQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    },
    'fourthQuintile': {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: point
    }
  };
}

export function generateMockRoundingSetting(): RoundingSetting {
  return {
      RoundingType: RoundingTypes.Round,
      RoundingPoint: 0
    };
}
