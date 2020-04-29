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
