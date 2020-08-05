import { SaveModelSettingsRequest, StructureRangeGroupResponse, RoundRangesRequest, RecalculateRangesWithoutMidRequest } from 'libs/models/payfactors-api/structures';
import { CompositeFieldResponse } from 'libs/models/payfactors-api/composite-field/composite-field-response.model';
import { CurrencyDto } from 'libs/models/common';
import { RoundingSettingsDataObj } from 'libs/models/structures';

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
      RangeDistributionTypeId: srgr.RangeDistributionTypeId ?? 1,
      RangeDistributionTypes: srgr.RangeDistributionTypes,
      RangeDistributionSetting: srgr.RangeDistributionSetting
    };
  }

  static mapCompositeFieldsToControlPoints(cfr: CompositeFieldResponse[]): ControlPoint[] {
    return cfr.map(cf => {
      return {
        FieldName: cf.FieldName,
        Display: cf.AppDisplayName,
        Category: cf.Category,
        RangeDisplayName: cf.DisplayName
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
    rangeGroupId: number, formValue: RangeGroupMetadata,
    rounding: RoundingSettingsDataObj): SaveModelSettingsRequest {
    return {
      RangeGroupId: rangeGroupId,
      ControlPoint: formValue.ControlPoint,
      CurrencyCode: formValue.Currency,
      ModelName: formValue.ModelName,
      RangeSpreadMin: formValue.SpreadMin,
      RangeSpreadMax: formValue.SpreadMax,
      Rate: formValue.Rate,
      StructureName: formValue.StructureName,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding),
      RangeDistributionTypeId: formValue.RangeDistributionTypeId ?? 1,
      RangeDistributionSetting: formValue.RangeDistributionSetting
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
    return {
      Min: roundingSettings['min'],
      Mid: roundingSettings['mid'],
      Max: roundingSettings['max'],
      FirstTertile: roundingSettings['firstTertile'],
      SecondTertile: roundingSettings['secondTertile'],
      FirstQuartile: roundingSettings['firstQuartile'],
      SecondQuartile: roundingSettings['secondQuartile'],
      FirstQuintile: roundingSettings['firstQuintile'],
      SecondQuintile: roundingSettings['secondQuintile'],
      ThirdQuintile: roundingSettings['thirdQuintile'],
      FourthQuintile: roundingSettings['fourthQuintile']
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
