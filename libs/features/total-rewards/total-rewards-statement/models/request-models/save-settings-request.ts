import { FontFamily, FontSize } from '../../types';

export interface SaveSettingsRequest {
  StatementId: string;
  FontSize: FontSize;
  FontFamily: FontFamily;
  Colors: string[];
}
