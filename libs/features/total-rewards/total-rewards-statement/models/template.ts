import { Page } from './page';
import { Settings } from './settings';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  Pages: Page[];
  Settings: Settings;
}
