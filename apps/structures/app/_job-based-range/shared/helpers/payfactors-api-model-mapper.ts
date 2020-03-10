import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';

import { RangeGroupMetadata } from '../models';

export class PayfactorsApiModelMapper {

  static mapStructuresRangeGroupResponseToRangeGroupMetadata(srgr: StructureRangeGroupResponse): RangeGroupMetadata {
    return {
      Currency: srgr.Currency,
      Name: srgr.RangeGroupName,
      Paymarket: srgr.PayMarket,
      Rate: srgr.Rate,
      ControlPoint: srgr.ControlPoint,
      ControlPointDisplay: this.getControlPointDisplayValue(srgr.ControlPoint)
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
