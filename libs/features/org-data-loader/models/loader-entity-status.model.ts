import { LoaderType } from 'libs/features/org-data-loader/constants';
import { FieldMapping } from './field-mapping.model';

export interface LoaderEntityStatus {
  complete: boolean;
  dateFormat?: string;
  isFullReplace?: boolean;
  loadEnabled?: boolean;
  loaderType: LoaderType;
  mappings?: FieldMapping[];
}
