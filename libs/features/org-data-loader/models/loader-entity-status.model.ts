import { LoaderType } from 'libs/features/org-data-loader/constants';

export interface LoaderEntityStatus {
  complete: boolean;
  dateFormat?: string;
  isFullReplace?: boolean;
  loadEnabled?: boolean;
  loaderType: LoaderType;
  mappings?: string[];
}
