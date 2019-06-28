import { LoaderType } from 'libs/constants';

export interface LoaderEntityStatus {
  complete: boolean;
  dateFormat?: string;
  isFullReplace?: boolean;
  loadEnabled?: boolean;
  loaderType: LoaderType;
  mappings?: string[];
}
