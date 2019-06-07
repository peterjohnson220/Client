import { LoaderType } from '../constants/loader-type.enum';

export interface LoaderEntityStatus {
  complete: boolean;
  dateFormat?: string;
  isFullReplace?: boolean;
  loadEnabled?: boolean;
  loaderType: LoaderType;
  mappings?: string[];
}
