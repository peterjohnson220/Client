export interface RangeDistributionSetting {
  CompanyStructuresRangeGroupId: number;
  RangeDistributionTypeId: number;
  CompanyId: number;
  FirstTertile: string;
  SecondTertile: string;
  FirstQuartile: string;
  SecondQuartile: string;
  FirstQuintile: string;
  SecondQuintile: string;
  ThirdQuintile: string;
  FourthQuintile: string;
}

export function generateMockRangeDistributionSetting(): RangeDistributionSetting {
  return  {
    CompanyStructuresRangeGroupId: 0,
    RangeDistributionTypeId: 0,
    CompanyId: 0,
    FirstTertile: '',
    SecondTertile: '',
    FirstQuartile: '',
    SecondQuartile: '',
    FirstQuintile: '',
    SecondQuintile: '',
    ThirdQuintile: '',
    FourthQuintile: ''
  };
}
