import { LoaderType } from 'libs/features/loaders/org-data-loader/constants';

import { LoaderFieldMapping } from './loader-field-mapping.model';

export interface LoaderFieldSet {
  CompanyId: number;
  LoaderType: LoaderType;
  LoaderFieldMappings: LoaderFieldMapping[];
}
