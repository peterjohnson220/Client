import { RecalcAndSaveRangeMinMaxRequest } from 'libs/models/payfactors-api/structures';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';

export class PayfactorsApiModelMapper {

  ///
  /// OUT
  ///

  static mapUpdateRangeInputToRecalcAndSaveRangeMinMaxRequest
  (rangeGroupId: number,
   rangeId: number,
   fieldValue: number,
   fieldName: string,
   rangeRecalculationType: RangeRecalculationType,
   rowIndex: number): RecalcAndSaveRangeMinMaxRequest {
    return {
      RangeGroupId: rangeGroupId,
      RangeId: rangeId,
      RowIndex: rowIndex,
      FieldValue: fieldValue,
      FieldName: this.translateFieldName(fieldName),
      RangeRecalculationType: rangeRecalculationType
    };
  }

  private static translateFieldName(fieldName: string) {
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
