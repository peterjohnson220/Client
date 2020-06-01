import { RecalcAndSaveRangeMinMaxRequest, SaveModelSettingsRequest, StructureRangeGroupResponse, RoundRangesRequest,
  RecalculateRangesWithoutMidRequest } from 'libs/models/payfactors-api/structures';
import { CompositeFieldResponse } from 'libs/models/payfactors-api/composite-field/composite-field-response.model';
import { CurrencyDto } from 'libs/models/common';
import { RoundingSettingsDataObj, RoundingSetting } from 'libs/models/structures';

import { ControlPoint, Currency, RangeGroupMetadata } from '../models';

export class PayfactorsApiModelMapper {

  ///
  /// IN
  ///
  static mapStructuresRangeGroupResponseToRangeGroupMetadata(srgr: StructureRangeGroupResponse): RangeGroupMetadata {
    return {
      Currency: srgr.Currency,
      StructureName: srgr.StructureName,
      Paymarket: srgr.PayMarket,
      PaymarketId: srgr.CompanyPayMarketId,
      Rate: srgr.Rate,
      ControlPoint: srgr.ControlPoint,
      ControlPointDisplay: this.getControlPointDisplayValue(srgr.ControlPoint),
      ModelName: srgr.RangeGroupName,
      SpreadMin: srgr.RangeSpreadMin,
      SpreadMax: srgr.RangeSpreadMax,
      IsCurrent: srgr.IsCurrent,
      RangeDistributionTypeId: srgr.RangeDistributionTypeId,
      RangeDistributionTypes: srgr.RangeDistributionTypes,
      RangeDistributionTypeSetting: srgr.RangeDistributionTypeSetting
    };
  }

  static mapCompositeFieldsToControlPoints(cfr: CompositeFieldResponse[]): ControlPoint[] {
    return cfr.map(cf => {
      return {
        FieldName: cf.FieldName,
        Display: cf.AppDisplayName
      };
    });
  }

  static mapCurrencyDtosToCurrency(cu: CurrencyDto[]): Currency[] {
    return cu.map(c => {
      return {
        CurrencyCode: c.CurrencyCode,
        CurrencyName: c.CurrencyName,
        CurrencyDisplay: `${c.CurrencyCode} - ${c.CurrencyName}`
      };
    });
  }

  ///
  /// OUT
  ///
  static mapModelSettingsModalFormToSaveSettingsRequest(
    rangeGroupId: number, formValue: any,
    rounding: RoundingSettingsDataObj, metadata: RangeGroupMetadata): SaveModelSettingsRequest {
    return {
      RangeGroupId: rangeGroupId,
      ControlPoint: formValue.controlPoint,
      CurrencyCode: formValue.currency,
      ModelName: formValue.modelName,
      RangeSpreadMin: formValue.spreadMin,
      RangeSpreadMax: formValue.spreadMax,
      Rate: formValue.rate,
      StructureName: formValue.structureName,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding),
      RangeDistributionTypeId: metadata.RangeDistributionTypeId
    };
  }

  static mapRecalculateRangesWithoutMidInputToRecalculateRangesWithoutMidRequest
  (rangeGroupId: number,
   rounding: RoundingSettingsDataObj): RecalculateRangesWithoutMidRequest {
    return {
      RangeGroupId: rangeGroupId,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding)
    };
  }

  static mapRoundingSettingsModalFormToRoundRangesRequest(roundingSettings: RoundingSettingsDataObj): RoundRangesRequest {
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

  private static getControlPointDisplayValue(controlPoint: string): string {
    switch (controlPoint) {
      case 'BaseMRP':
        return 'Base Salary';
      case 'BonusMRP':
        return 'Bonus';
      case 'BonusPctMRP':
        return 'Bonus Pct';
      case 'BonusTargetMRP':
        return 'Bonus Target';
      case 'BonusTargetPctMRP':
        return 'Bonus Target Pct';
      case 'TCCMRP':
        return 'TCC';
      case 'TCCTargetMRP':
        return 'Target TCC';
      case 'LTIPMRP':
        return 'LTI';
      case 'TargetLTIPMRP':
        return 'Target LTI';
      case 'TDCMRP':
        return 'TDC';
      case 'TargetTDCMRP':
        return 'Target TDC';
      case 'AllowMRP':
        return 'Allowances';
      case 'FixedMRP':
        return 'Total Fixed Pay';
      case 'TGPMRP':
        return 'Total Guaranteed Pay';
      case 'RemunMRP':
        return 'Total Remuneration';
      default:
        return 'Salary';
    }
  }
}
