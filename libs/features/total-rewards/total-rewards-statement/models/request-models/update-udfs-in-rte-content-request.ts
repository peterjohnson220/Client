import { UpdateControlBase } from './update-control-base';
import { RichTextDataField } from '../rich-text-data-field';

export interface UpdateUdfsInRteContentRequest extends UpdateControlBase {
  UdfDataFieldsInContent: RichTextDataField[];
}
