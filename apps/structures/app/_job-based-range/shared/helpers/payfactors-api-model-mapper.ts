import {
  AdvancedSettingResponse,
  RangeDistributionSettingResponse,
  RecalculateRangesWithoutMidRequest,
  RevertRangeChangesRequest,
  RoundRangesRequest,
  RangeDistributionSettingRequest,
  SaveModelSettingsRequest,
  StructureRangeGroupResponse
} from 'libs/models/payfactors-api/structures';
import { CompositeFieldResponse } from 'libs/models/payfactors-api/composite-field/composite-field-response.model';
import { CurrencyDto } from 'libs/models/common';
import {
  AdvancedModelSettingForm,
  RangeDistributionSettingForm,
  CalculationTypeDisplay,
  RangeGroupMetadata,
  RoundingSettingsDataObj
} from 'libs/models/structures';
import { AdvancedSettingRequest } from 'libs/models/payfactors-api/structures/request/advanced-setting-request.model';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';
import { CalculationType } from 'libs/constants/structures/calculation-type';
import { FormulaFieldModalObj } from 'libs/models/formula-editor';


import { ControlPoint, Currency } from '../models';

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
      ExchangeId: srgr.ExchangeId,
      RangeDistributionTypes: srgr.RangeDistributionTypes,
      RangeDistributionSetting: srgr.RangeDistributionSetting != null ? this.mapRangeDistributionSetting(srgr.RangeDistributionSetting) : null,
      RangeAdvancedSetting: srgr.RangeAdvancedSetting != null ? this.mapRangeAdvancedSetting(srgr.RangeAdvancedSetting) : null
    };
  }


  static mapRangeDistributionSetting(rangeDistributionSetting: RangeDistributionSettingResponse): RangeDistributionSettingForm {
    return {
      CompanyStructuresRangeGroupId: rangeDistributionSetting.CompanyStructuresRangeGroupId,
      CompanyId: rangeDistributionSetting.CompanyId,
      RangeDistributionTypeId: rangeDistributionSetting.RangeDistributionTypeId,
      FirstTertile_Percentile: rangeDistributionSetting.FirstTertile,
      SecondTertile_Percentile: rangeDistributionSetting.SecondTertile,
      FirstQuartile_Percentile: rangeDistributionSetting.FirstQuartile,
      SecondQuartile_Percentile: rangeDistributionSetting.SecondQuartile,
      FirstQuintile_Percentile: rangeDistributionSetting.FirstQuintile,
      SecondQuintile_Percentile: rangeDistributionSetting.SecondQuintile,
      ThirdQuintile_Percentile: rangeDistributionSetting.ThirdQuintile,
      FourthQuintile_Percentile: rangeDistributionSetting.FourthQuintile,
      Min_Spread: null,
      Max_Spread: null,
      PayType: null,
      Mid_Percentile: null,
      Min_Percentile: rangeDistributionSetting.MinPercentile,
      Max_Percentile: rangeDistributionSetting.MaxPercentile,
      Mid_Formula: rangeDistributionSetting.ControlPoint_Formula,
      Min_Formula: rangeDistributionSetting.Min_Formula,
      Max_Formula: rangeDistributionSetting.Max_Formula,
      FirstTertile_Formula: rangeDistributionSetting.FirstTertile_Formula,
      SecondTertile_Formula: rangeDistributionSetting.SecondTertile_Formula,
      FirstQuartile_Formula: rangeDistributionSetting.FirstQuartile_Formula,
      SecondQuartile_Formula: rangeDistributionSetting.SecondQuartile_Formula,
      FirstQuintile_Formula: rangeDistributionSetting.FirstQuintile_Formula,
      SecondQuintile_Formula: rangeDistributionSetting.SecondQuintile_Formula,
      ThirdQuintile_Formula: rangeDistributionSetting.ThirdQuintile_Formula,
      FourthQuintile_Formula: rangeDistributionSetting.FourthQuintile_Formula,
      MinCalculationType: this.determineCalculationType(rangeDistributionSetting.MinPercentile, rangeDistributionSetting.Min_Formula),
      MaxCalculationType: this.determineCalculationType(rangeDistributionSetting.MaxPercentile, rangeDistributionSetting.Max_Formula)
    };
  }

  private static determineCalculationType(percentile: string, formula: FormulaFieldModalObj): CalculationTypeDisplay {
    if (!!formula) {
      return { TypeDisplay: 'Calculate', Type: CalculationType.Formula };
    } else if (!!percentile) {
      return { TypeDisplay: 'Enter Percentile Amount', Type: CalculationType.Percentile };
    } else {
      return { TypeDisplay: 'Enter Range Spread', Type: CalculationType.Spread };
    }
  }

  static mapRangeAdvancedSetting(advancedSetting: AdvancedSettingResponse): AdvancedModelSettingForm {
    let increaseMidpointByPercentage = null;
    let decreasePercentFromNextLevelPercentage = null;
    let increasePercentFromPreviousLevelPercentage = null;

    if (advancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreaseMidpointByPercent) {
      increaseMidpointByPercentage = advancedSetting.MissingMarketDataType.Percentage;
    } else if (advancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.DecreasePercentFromNextLevel) {
      decreasePercentFromNextLevelPercentage = advancedSetting.MissingMarketDataType.Percentage;
    } else if (advancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreasePercentFromPreviousLevel) {
      increasePercentFromPreviousLevelPercentage = advancedSetting.MissingMarketDataType.Percentage;
    }

    return {
      Rounding: this.mapRoundingSetttings(advancedSetting),
      PreventMidsBelowCurrent: advancedSetting.PreventMidsBelowCurrent,
      PreventMidsFromIncreasingMoreThanPercent: advancedSetting.PreventMidsFromIncreasingMoreThanPercent,
      PreventMidsFromIncreasingWithinPercentOfNextLevel: advancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel,
      MissingMarketDataType: {
        Type: advancedSetting.MissingMarketDataType.Type,
        IncreaseMidpointByPercentage: increaseMidpointByPercentage,
        DecreasePercentFromNextLevelPercentage: decreasePercentFromNextLevelPercentage,
        IncreasePercentFromPreviousLevelPercentage: increasePercentFromPreviousLevelPercentage
      }
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
        RangeDisplayName: cf.DisplayName,
        PayTypeDisplay: cf.AppDisplayName
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
    rangeGroupId: number, formValue: any, rounding: RoundingSettingsDataObj, advancedSetting: AdvancedSettingRequest,
    rangeDistributionSetting: RangeDistributionSettingForm): SaveModelSettingsRequest {

    // TODO remove this as soon as Rounding will be part of AdvancedSetting
    advancedSetting.Rounding = this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding);

    return {
      RangeGroupId: rangeGroupId,
      PayType: rangeDistributionSetting.PayType,
      ControlPoint: rangeDistributionSetting.Mid_Percentile,
      CurrencyCode: formValue.Currency,
      ModelName: formValue.ModelName,
      RangeSpreadMin: rangeDistributionSetting.Min_Spread,
      RangeSpreadMax: rangeDistributionSetting.Max_Spread,
      Rate: formValue.Rate,
      StructureName: formValue.StructureName,
      ExchangeId: formValue.ExchangeId,
      Rounding: this.mapRoundingSettingsModalFormToRoundRangesRequest(rounding),
      AdvancedSetting: advancedSetting,
      RangeDistributionTypeId: rangeDistributionSetting.RangeDistributionTypeId ?? 1,
      RangeDistributionSetting: this.mapRangeDistributionSettingRequest(formValue.RangeDistributionSetting)
    };
  }

  static mapRangeDistributionSettingRequest(rangeDistributionSetting: RangeDistributionSettingForm): RangeDistributionSettingRequest {
    return {
      CompanyStructuresRangeGroupId: rangeDistributionSetting.CompanyStructuresRangeGroupId,
      RangeDistributionTypeId: rangeDistributionSetting.RangeDistributionTypeId,
      CompanyId: rangeDistributionSetting.CompanyId,
      FirstTertile: rangeDistributionSetting.FirstTertile_Percentile,
      SecondTertile: rangeDistributionSetting.SecondTertile_Percentile,
      FirstQuartile: rangeDistributionSetting.FirstQuartile_Percentile,
      SecondQuartile: rangeDistributionSetting.SecondQuartile_Percentile,
      FirstQuintile: rangeDistributionSetting.FirstQuintile_Percentile,
      SecondQuintile: rangeDistributionSetting.SecondQuintile_Percentile,
      ThirdQuintile: rangeDistributionSetting.ThirdQuintile_Percentile,
      FourthQuintile: rangeDistributionSetting.FourthQuintile_Percentile,
      MinPercentile: rangeDistributionSetting.Min_Percentile,
      MaxPercentile: rangeDistributionSetting.Max_Percentile,
      ControlPoint_Formula: rangeDistributionSetting.Mid_Formula,
      Min_Formula: rangeDistributionSetting.Min_Formula,
      Max_Formula: rangeDistributionSetting.Max_Formula,
      FirstTertile_Formula: rangeDistributionSetting.FirstTertile_Formula,
      SecondTertile_Formula: rangeDistributionSetting.SecondTertile_Formula,
      FirstQuartile_Formula: rangeDistributionSetting.FirstQuartile_Formula,
      SecondQuartile_Formula: rangeDistributionSetting.SecondQuartile_Formula,
      FirstQuintile_Formula: rangeDistributionSetting.FirstQuintile_Formula,
      SecondQuintile_Formula: rangeDistributionSetting.SecondQuintile_Formula,
      ThirdQuintile_Formula: rangeDistributionSetting.ThirdQuintile_Formula,
      FourthQuintile_Formula: rangeDistributionSetting.FourthQuintile_Formula
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

  static mapAdvancedSettingModalFormToAdvancedSettingRequest(advancedSetting: AdvancedModelSettingForm): AdvancedSettingRequest {
    let missingMarketDataTypePercentage = null;
    if (advancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreaseMidpointByPercent) {
      missingMarketDataTypePercentage = advancedSetting.MissingMarketDataType.IncreaseMidpointByPercentage;
    } else if (advancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.DecreasePercentFromNextLevel) {
      missingMarketDataTypePercentage = advancedSetting.MissingMarketDataType.DecreasePercentFromNextLevelPercentage;
    } else if (advancedSetting.MissingMarketDataType.Type === MissingMarketDataTypes.IncreasePercentFromPreviousLevel) {
      missingMarketDataTypePercentage = advancedSetting.MissingMarketDataType.IncreasePercentFromPreviousLevelPercentage;
    }

    return {
      Rounding: advancedSetting.Rounding != null ? this.mapRoundingSettingsModalFormToRoundRangesRequest(advancedSetting.Rounding) : null,
      PreventMidsBelowCurrent: advancedSetting.PreventMidsBelowCurrent,
      PreventMidsFromIncreasingMoreThanPercent: advancedSetting.PreventMidsFromIncreasingMoreThanPercent,
      PreventMidsFromIncreasingWithinPercentOfNextLevel: advancedSetting.PreventMidsFromIncreasingWithinPercentOfNextLevel,
      MissingMarketDataType: {
        Type: advancedSetting.MissingMarketDataType.Type,
        Percentage: missingMarketDataTypePercentage
      }
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
