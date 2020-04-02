import { SaveModelSettingsRequest, StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';

import { Currency, RangeGroupMetadata } from '../models';
import { ControlPoint } from '../models/control-point.model';
import { CompositeFieldResponse } from 'libs/models/payfactors-api/composite-field/composite-field-response.model';
import { CurrencyDto } from 'libs/models/common';

export class PayfactorsApiModelMapper {

  ///
  /// IN
  ///
  static mapStructuresRangeGroupResponseToRangeGroupMetadata(srgr: StructureRangeGroupResponse): RangeGroupMetadata {
    return {
      Currency: srgr.Currency,
      StructureName: srgr.StructureName,
      Paymarket: srgr.PayMarket,
      Rate: srgr.Rate,
      ControlPoint: srgr.ControlPoint,
      ControlPointDisplay: this.getControlPointDisplayValue(srgr.ControlPoint),
      ModelName: srgr.RangeGroupName,
      SpreadMin: srgr.RangeSpreadMin,
      SpreadMax: srgr.RangeSpreadMax,
      IsCurrent: srgr.IsCurrent
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
  static mapModelSettingsModalFormToSaveSettingsRequest(rangeGroupId: number, formValue: any): SaveModelSettingsRequest {
    return {
      RangeGroupId: rangeGroupId,
      ControlPoint: formValue.controlPoint,
      CurrencyCode: formValue.currency,
      ModelName: formValue.modelName,
      RangeSpreadMin: formValue.spreadMin,
      RangeSpreadMax: formValue.spreadMax,
      Rate: formValue.rate,
      StructureName: formValue.structureName
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
