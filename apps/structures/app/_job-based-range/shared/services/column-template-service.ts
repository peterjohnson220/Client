export class ColumnTemplateService {

  static configureJobRangeTemplates(columnTemplateRefs) {
    return {
      ['Min']: {Template: columnTemplateRefs['min']},
      ['Mid']: {Template: columnTemplateRefs['mid']},
      ['Max']: {Template: columnTemplateRefs['max']},
      ['NumEmployees']: {Template: columnTemplateRefs['eeCount']},
      ['AvgBaseSalary']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgBonus']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgSTI']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgBonusTarget']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgTargetTCC']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgLTIP']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgTargetLTIP']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgTargetTDC']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgAllowances']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgFixedPay']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgTGP']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgRemuneration']: {Template: columnTemplateRefs['rangeValue']},
      ['CurrentMin']: {Template: columnTemplateRefs['rangeValue']},
      ['CurrentStructureMidPoint']: {Template: columnTemplateRefs['rangeValue']},
      ['CurrentMax']: {Template: columnTemplateRefs['rangeValue']},
      ['CurrentRangeSpreadMin']: {Template: columnTemplateRefs['rangeValue']},
      ['CurrentRangeSpreadMax']: {Template: columnTemplateRefs['rangeValue']},
      ['MarketReferencePointValue']: {Template: columnTemplateRefs['mrpValue']},
      ['AverageComparatio']: {Template: columnTemplateRefs['percentage']},
      ['AveragePositionInRange']: {Template: columnTemplateRefs['percentage']},
      ['CurrentAvgComparatio']: {Template: columnTemplateRefs['percentage']},
      ['CurrentAvgPositionInRange']: {Template: columnTemplateRefs['percentage']},
      ['CurrentMidpointDiff']: {Template: columnTemplateRefs['percentage']},
      ['AvgBonusPct']: {Template: columnTemplateRefs['percentage']},
      ['AvgBonusTargetPct']: {Template: columnTemplateRefs['percentage']},
      ['TotalPayroll']: {Template: columnTemplateRefs['rangeValue']},
      ['TotalPayrollUnderMin']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgTCC']: {Template: columnTemplateRefs['rangeValue']},
      ['AvgTDC']: {Template: columnTemplateRefs['rangeValue']}

    };

  }

  static configureEmployeeTemplates(columnTemplateRefs) {
    return {
      ['ComparatioStructureRangeGroup']: {Template: columnTemplateRefs['percentage']},
      ['PositionInRangeStructureRangeGroup']: {Template: columnTemplateRefs['percentage']},
      ['Allow']: {Template: columnTemplateRefs['rangeValue']},
      ['Bonus']: {Template: columnTemplateRefs['rangeValue']},
      ['Bonus_Target']: {Template: columnTemplateRefs['rangeValue']},
      ['Fixed']: {Template: columnTemplateRefs['rangeValue']},
      ['LTI']: {Template: columnTemplateRefs['rangeValue']},
      ['Remun']: {Template: columnTemplateRefs['rangeValue']},
      ['STI']: {Template: columnTemplateRefs['rangeValue']},
      ['TargetLTIP']: {Template: columnTemplateRefs['rangeValue']},
      ['TargetTCC']: {Template: columnTemplateRefs['rangeValue']},
      ['TargetTDC']: {Template: columnTemplateRefs['rangeValue']},
      ['TGP']: {Template: columnTemplateRefs['rangeValue']},
      ['BaseSalaryCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['TCCCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['TDCCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['CurrentEmployeeComparatio']: {Template: columnTemplateRefs['percentage']},
      ['CurrentEmployeePositionInRange']: {Template: columnTemplateRefs['percentage']},
      ['BonusPct']: {Template: columnTemplateRefs['percentage']},
      ['BonusTargetPct']: {Template: columnTemplateRefs['percentage']}

    };
  }

  static configurePricingsTemplates(columnTemplateRefs) {
    return {
      ['Source']: {Template: columnTemplateRefs['source']},
      ['Job_Title']: {Template: columnTemplateRefs['jobTitleCode']},
      ['Base25thCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['Base50thCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['Base75thCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['TCC25thCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['TCC50thCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']},
      ['TCC75thCalculatedStructureRangeGroup']: {Template: columnTemplateRefs['rangeValue']}
    };
  }

}
