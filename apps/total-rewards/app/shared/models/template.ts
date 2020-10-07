import { Page } from './page';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  Pages: Page[];
}
