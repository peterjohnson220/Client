import { ElementRef } from '@angular/core';

export class ColumnTemplateService {

  static configureJobRangeTemplates(minColumn: ElementRef, midColumn: ElementRef, maxColumn: ElementRef,
                                    eeCountColumn: ElementRef, rangeValueColumn: ElementRef, percentageColumn: ElementRef,
                                    mrpValueColumn: ElementRef) {
    return {
      ['Min']: {Template: minColumn},
      ['Mid']: {Template: midColumn},
      ['Max']: {Template: maxColumn},
      ['NumEmployees']: {Template: eeCountColumn},
      ['AvgBaseSalary']: {Template: rangeValueColumn},
      ['AvgBonus']: {Template: rangeValueColumn},
      ['AvgSTI']: {Template: rangeValueColumn},
      ['AvgBonusTarget']: {Template: rangeValueColumn},
      ['AvgTargetTCC']: {Template: rangeValueColumn},
      ['AvgLTIP']: {Template: rangeValueColumn},
      ['AvgTargetLTIP']: {Template: rangeValueColumn},
      ['AvgTargetTDC']: {Template: rangeValueColumn},
      ['AvgAllowances']: {Template: rangeValueColumn},
      ['AvgFixedPay']: {Template: rangeValueColumn},
      ['AvgTGP']: {Template: rangeValueColumn},
      ['AvgRemuneration']: {Template: rangeValueColumn},
      ['CurrentMin']: {Template: rangeValueColumn},
      ['CurrentStructureMidPoint']: {Template: rangeValueColumn},
      ['CurrentMax']: {Template: rangeValueColumn},
      ['CurrentRangeSpreadMin']: {Template: rangeValueColumn},
      ['CurrentRangeSpreadMax']: {Template: rangeValueColumn},
      ['MarketReferencePointValue']: {Template: mrpValueColumn},
      ['AverageComparatio']: {Template: percentageColumn},
      ['AveragePositionInRange']: {Template: percentageColumn},
      ['CurrentAvgComparatio']: {Template: percentageColumn},
      ['CurrentAvgPositionInRange']: {Template: percentageColumn},
      ['CurrentMidpointDiff']: {Template: percentageColumn},
      ['AvgBonusPct']: {Template: percentageColumn},
      ['AvgBonusTargetPct']: {Template: percentageColumn}
    };

  }

}
