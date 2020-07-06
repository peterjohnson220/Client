import { RoundingSetting } from 'libs/models';

export interface RoundRangesRequest {
  Min: RoundingSetting;
  Mid: RoundingSetting;
  Max: RoundingSetting;
  FirstTertile?: RoundingSetting;
  SecondTertile?: RoundingSetting;
  FirstQuartile?: RoundingSetting;
  SecondQuartile?: RoundingSetting;
  FirstQuintile?: RoundingSetting;
  SecondQuintile?: RoundingSetting;
  ThirdQuintile?: RoundingSetting;
  FourthQuintile?: RoundingSetting;
}
