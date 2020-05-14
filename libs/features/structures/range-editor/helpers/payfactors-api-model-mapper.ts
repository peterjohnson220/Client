import { RecalcAndSaveRangeMinMaxRequest, RoundRangesRequest } from 'libs/models/payfactors-api/structures';
import { RoundingSettingsDataObj, RoundingSetting } from 'libs/models/structures';

export class PayfactorsApiModelMapper {

  ///
  /// OUT
  ///
  static mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest
  (rangeGroupId: number,
   rangeId: number,
   mid: number,
   rowIndex: number,
   rounding: RoundingSettingsDataObj): RecalcAndSaveRangeMinMaxRequest {
    return {
      RangeGroupId: rangeGroupId,
      RangeId: rangeId,
      RowIndex: rowIndex,
      Mid: mid,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding)
    };
  }

  static mapRoundingSettingsModalFormToRoundRangesRequest(roundingSettings: RoundingSettingsDataObj): RoundRangesRequest {
    if (roundingSettings == null) {
      return null;
    }

    let min: RoundingSetting;
    let mid: RoundingSetting;
    let max: RoundingSetting;

    min = roundingSettings['min'];
    mid = roundingSettings['mid'];
    max = roundingSettings['max'];

    return {
      MinRoundingType: min.RoundingType,
      MinRoundingPoint: min.RoundingPoint,
      MidRoundingType: mid.RoundingType,
      MidRoundingPoint: mid.RoundingPoint,
      MaxRoundingType: max.RoundingType,
      MaxRoundingPoint: max.RoundingPoint
    };
  }
}
