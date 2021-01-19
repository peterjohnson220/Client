import { BaseControl } from './base-control';
import { RichTextDataField } from './rich-text-data-field';

export interface RichTextControl extends BaseControl {
  Content: string;
  DataFields: RichTextDataField[];
  Height: number;
  ShowTitle: boolean;
}
