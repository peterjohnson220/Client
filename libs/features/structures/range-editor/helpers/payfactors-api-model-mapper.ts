import { OverrideAndSaveRangeFieldRequest, RecalcAndSaveRangeMinMaxRequest, RoundRangesRequest } from 'libs/models/payfactors-api/structures';
import { RoundingSettingsDataObj, RoundingSetting } from 'libs/models/structures';

export class PayfactorsApiModelMapper {

  ///
  /// OUT
  ///

  static mapUpdateRangeFieldToOverrideAndSaveRangeFieldRequest
  (rangeId: number,
   fieldValue: number,
   fieldName: string,
   rowIndex: number): OverrideAndSaveRangeFieldRequest {
    return {
      RangeId: rangeId,
      RowIndex: rowIndex,
      Value: fieldValue,
      FieldName: this.translateFieldName(fieldName)
    };
  }

  static mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest
  (rangeGroupId: number,
   rangeId: number,
   fieldValue: number,
   fieldName: string,
   isMid: boolean,
   rowIndex: number,
   rounding: RoundingSettingsDataObj): RecalcAndSaveRangeMinMaxRequest {
    return {
      RangeGroupId: rangeGroupId,
      RangeId: rangeId,
      RowIndex: rowIndex,
      FieldValue: fieldValue,
      FieldName: this.translateFieldName(fieldName),
      IsMid: isMid,
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

  private static translateFieldName (fieldName: string) {
    switch (fieldName) {
      case 'CompanyStructures_Ranges_Min':
        return 'Min';
      case 'CompanyStructures_Ranges_Max':
        return 'Max';
      case 'CompanyStructures_Ranges_Tertile_First':
        return 'FirstTertile';
      case 'CompanyStructures_Ranges_Tertile_Second':
        return 'SecondTertile';
      case 'CompanyStructures_Ranges_Quartile_First':
        return 'FirstQuartile';
      case 'CompanyStructures_Ranges_Quartile_Second':
        return 'SecondQuartile';
      case 'CompanyStructures_Ranges_Quintile_First':
        return 'FirstQuintile';
      case 'CompanyStructures_Ranges_Quintile_Second':
        return 'SecondQuintile';
      case 'CompanyStructures_Ranges_Quintile_Third':
        return 'ThirdQuintile';
      case 'CompanyStructures_Ranges_Quintile_Fourth':
        return 'FourthQuintile';
      default:
        return 'Mid';
    }
  }
}
