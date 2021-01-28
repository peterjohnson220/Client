export interface CompanyStructureRangeOverride {
  CompanyStructuresRangesId: number;
  Min: boolean;
  Mid: boolean;
  Max: boolean;
  FirstTertile: boolean;
  SecondTertile: boolean;
  FirstQuartile: boolean;
  SecondQuartile: boolean;
  FirstQuintile: boolean;
  SecondQuintile: boolean;
  ThirdQuintile: boolean;
  FourthQuintile: boolean;
  MidForcedToCurrent: boolean;
  UsePublishedRange: boolean;
  MidForcedToCurrentPercent: boolean;
  IncreaseCurrentByPercent: boolean;
  MidDiffPercent: boolean;
  RangeSpread: boolean;
}
