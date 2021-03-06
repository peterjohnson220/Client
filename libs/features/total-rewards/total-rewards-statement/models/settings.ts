import { StatementAdditionalPageSettings, StatementAdditionalPagePlacementEnum } from './statement-additional-page-settings';
import { FontFamily, FontSize } from '../types';
import { StatementDisplaySettings } from './statement-display-settings';

export enum TotalRewardsColorEnum { Undefined = 0, Primary = 1, Secondary = 2, Tertiary = 3, Quaternary = 4 }
export enum FieldLayout { Normal = 0, Consolidated = 1 }

export interface Settings {
  Colors: string[];
  DividerColor: TotalRewardsColorEnum;
  FontSize: FontSize;
  FontFamily: FontFamily;
  DisplaySettings: StatementDisplaySettings;
  AdditionalPageSettings: StatementAdditionalPageSettings;
}

export function generateMockSettings(): Settings {
  return {
    Colors: ['#1f2f3d', '#0883be', '#ffb300', '#dc1e34'],
    DividerColor: TotalRewardsColorEnum.Undefined,
    FontSize: 'Medium',
    FontFamily: 'Default',
    DisplaySettings: { ShowEmployeeContributions: false, ShowDecimals: false, ShowEmployeeId: true, ShowInformationEffectiveDate: true },
    AdditionalPageSettings: {PagePlacement: StatementAdditionalPagePlacementEnum.None, ShowStatementHeader: false}
  };
}
