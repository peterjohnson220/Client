import {
  SaveModelSettingsRequest,
  StructureRangeGroupResponse,
  RoundRangesRequest,
  RecalculateRangesWithoutMidRequest,
  RevertRangeChangesRequest,
  AdvancedSettingResponse
} from 'libs/models/payfactors-api/structures';
import { CompositeFieldResponse } from 'libs/models/payfactors-api/composite-field/composite-field-response.model';
import { CurrencyDto } from 'libs/models/common';
import { RoundingSettingsDataObj } from 'libs/models/structures';
import { AdvancedSettingRequest } from 'libs/models/payfactors-api/structures/request/advanced-setting-request.model';

import { AdvancedSetting, ControlPoint, Currency, RangeGroupMetadata } from '../models';


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
      PayType: srgr.PayType,
      ControlPoint: srgr.ControlPoint,
      ControlPointDisplay: this.getControlPointDisplayValue(srgr.ControlPoint),
      ModelName: srgr.RangeGroupName,
      SpreadMin: srgr.RangeSpreadMin,
      SpreadMax: srgr.RangeSpreadMax,
      IsCurrent: srgr.IsCurrent,
      RangeDistributionTypeId: srgr.RangeDistributionTypeId ?? 1,
      RangeDistributionTypes: srgr.RangeDistributionTypes,
      RangeDistributionSetting: srgr.RangeDistributionSetting,
      RangeAdvancedSetting: srgr.RangeAdvancedSetting != null ? this.mapRangeAdvancedSetting(srgr.RangeAdvancedSetting) : null
    };
  }

  static mapRangeAdvancedSetting(advancedSetting: AdvancedSettingResponse): AdvancedSetting {
    return {
      Rounding: this.mapRoundingSetttings(advancedSetting),
      PreventMidsBelowCurrent: advancedSetting.PreventMidsBelowCurrent,
      PreventMidsFromIncreasingMoreThanPercent: advancedSetting.PreventMidsFromIncreasingMoreThanPercent,
      PreventMidsFromIncreasingWithinPercentOfNextLevel: advancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel,
      MissingMarketDataType: advancedSetting.MissingMarketDataType
    };
  }

  static mapRoundingSetttings(advancedSetting: AdvancedSettingResponse): RoundingSettingsDataObj {
    return {
      'min': {
        RoundingType: advancedSetting.Min.RoundingType,
        RoundingPoint: advancedSetting.Min.RoundingPoint
      },
      'mid': {
        RoundingType: advancedSetting.Mid.RoundingType,
        RoundingPoint: advancedSetting.Mid.RoundingPoint
      },
      'max': {
        RoundingType: advancedSetting.Max.RoundingType,
        RoundingPoint: advancedSetting.Max.RoundingPoint
      },
      'firstTertile': {
        RoundingType: advancedSetting.FirstTertile.RoundingType,
        RoundingPoint: advancedSetting.FirstTertile.RoundingPoint
      },
      'secondTertile': {
        RoundingType: advancedSetting.SecondTertile.RoundingType,
        RoundingPoint: advancedSetting.SecondTertile.RoundingPoint
      },
      'firstQuartile': {
        RoundingType: advancedSetting.FirstQuartile.RoundingType,
        RoundingPoint: advancedSetting.FirstQuartile.RoundingPoint
      },
      'secondQuartile': {
        RoundingType: advancedSetting.SecondQuartile.RoundingType,
        RoundingPoint: advancedSetting.SecondQuartile.RoundingPoint
      },
      'firstQuintile': {
        RoundingType: advancedSetting.FirstQuintile.RoundingType,
        RoundingPoint: advancedSetting.FirstQuintile.RoundingPoint
      },
      'secondQuintile': {
        RoundingType: advancedSetting.SecondQuintile.RoundingType,
        RoundingPoint: advancedSetting.SecondQuintile.RoundingPoint
      },
      'thirdQuintile': {
        RoundingType: advancedSetting.ThirdQuintile.RoundingType,
        RoundingPoint: advancedSetting.ThirdQuintile.RoundingPoint
      },
      'fourthQuintile': {
        RoundingType: advancedSetting.FourthQuintile.RoundingType,
        RoundingPoint: advancedSetting.FourthQuintile.RoundingPoint
      }
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

  static mapAdvancedSettingResponseToAdvancedSetting(cfr: CompositeFieldResponse[]): ControlPoint[] {
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
    rounding: RoundingSettingsDataObj, advancedSetting: AdvancedSettingRequest): SaveModelSettingsRequest {

    // TODO remove this as soon as Rounding will be part of AdvancedSetting
    advancedSetting.Rounding = this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding);

    return {
      RangeGroupId: rangeGroupId,
      PayType: formValue.PayType,
      ControlPoint: formValue.ControlPoint,
      CurrencyCode: formValue.Currency,
      ModelName: formValue.ModelName,
      RangeSpreadMin: formValue.SpreadMin,
      RangeSpreadMax: formValue.SpreadMax,
      Rate: formValue.Rate,
      StructureName: formValue.StructureName,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding),
      AdvancedSetting: advancedSetting,
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

  static mapAdvancedSettingModalFormToAdvancedSettingRequest(advancedSetting: AdvancedSetting): AdvancedSettingRequest {
    return {
      Rounding: advancedSetting.Rounding != null ? this.mapRoundingSettingsModalFormToRoundRangesRequest(advancedSetting.Rounding) : null,
      PreventMidsBelowCurrent: advancedSetting.PreventMidsBelowCurrent,
      PreventMidsFromIncreasingMoreThanPercent: advancedSetting.PreventMidsFromIncreasingMoreThanPercent,
      PreventMidsFromIncreasingWithinPercentOfNextLevel: advancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel,
      MissingMarketDataType: advancedSetting.MissingMarketDataType
    };
  }

  static mapRevertingRangeChangesToRevertRangeChangesRequest
  (rangeId: number,
   rangeGroupId: number,
   rounding: RoundingSettingsDataObj): RevertRangeChangesRequest {
    return {
      RangeId: rangeId,
      RangeGroupId: rangeGroupId,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding)
    };
  }

  private static getControlPointDisplayValue(controlPoint: string): string {
    switch (controlPoint) {
      case 'BaseMRP':
      case 'Base10':
      case 'Base25':
      case 'Base50':
      case 'Base60':
      case 'Base75':
      case 'Base90':
        return 'Base Salary';
      case 'BonusMRP':
      case 'Bonus10':
      case 'Bonus25':
      case 'Bonus50':
      case 'Bonus60':
      case 'Bonus75':
      case 'Bonus90':
        return 'Bonus';
      case 'BonusPctMRP':
      case 'BonusPct10':
      case 'BonusPct25':
      case 'BonusPct50':
      case 'BonusPct60':
      case 'BonusPct75':
      case 'BonusPct90':
        return 'Bonus Pct';
      case 'BonusTargetMRP':
      case 'BonusTarget10':
      case 'BonusTarget25':
      case 'BonusTarget50':
      case 'BonusTarget60':
      case 'BonusTarget75':
      case 'BonusTarget90':
        return 'Bonus Target';
      case 'BonusTargetPctMRP':
      case 'BonusTargetPct10':
      case 'BonusTargetPct25':
      case 'BonusTargetPct50':
      case 'BonusTargetPct60':
      case 'BonusTargetPct75':
      case 'BonusTargetPct90':
        return 'Bonus Target Pct';
      case 'TCCMRP':
      case 'TCC10':
      case 'TCC25':
      case 'TCC50':
      case 'TCC60':
      case 'TCC75':
      case 'TCC90':
        return 'TCC';
      case 'TCCTargetMRP':
      case 'TCCTarget10':
      case 'TCCTarget25':
      case 'TCCTarget50':
      case 'TCCTarget60':
      case 'TCCTarget75':
      case 'TCCTarget90':
        return 'Target TCC';
      case 'LTIPMRP':
      case 'LTIP10':
      case 'LTIP25':
      case 'LTIP50':
      case 'LTIP60':
      case 'LTIP75':
      case 'LTIP90':
        return 'LTI';
      case 'TargetLTIPMRP':
      case 'TargetLTIP10':
      case 'TargetLTIP25':
      case 'TargetLTIP50':
      case 'TargetLTIP60':
      case 'TargetLTIP75':
      case 'TargetLTIP90':
        return 'Target LTI';
      case 'TDCMRP':
      case 'TDC10':
      case 'TDC25':
      case 'TDC50':
      case 'TDC60':
      case 'TDC75':
      case 'TDC90':
        return 'TDC';
      case 'TargetTDCMRP':
      case 'TargetTDC10':
      case 'TargetTDC25':
      case 'TargetTDC50':
      case 'TargetTDC60':
      case 'TargetTDC75':
      case 'TargetTDC90':
        return 'Target TDC';
      case 'AllowMRP':
      case 'Allow10':
      case 'Allow25':
      case 'Allow50':
      case 'Allow60':
      case 'Allow75':
      case 'Allow90':
        return 'Allowances';
      case 'FixedMRP':
      case 'Fixed10':
      case 'Fixed25':
      case 'Fixed50':
      case 'Fixed60':
      case 'Fixed75':
      case 'Fixed90':
        return 'Total Fixed Pay';
      case 'TGPMRP':
      case 'TGP10':
      case 'TGP25':
      case 'TGP50':
      case 'TGP60':
      case 'TGP75':
      case 'TGP90':
        return 'Total Guaranteed Pay';
      case 'RemunMRP':
      case 'Remun10':
      case 'Remun25':
      case 'Remun50':
      case 'Remun60':
      case 'Remun75':
      case 'Remun90':
        return 'Total Remuneration';
      default:
        return 'Salary';
    }
  }
}
