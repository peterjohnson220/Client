import { LoaderFieldMapping } from './loader-field-mapping.model';
import { LoaderType } from 'libs/constants';

export interface LoaderFieldSet {
  CompanyId: number;
  LoaderType: LoaderType;
  LoaderFieldMappings: LoaderFieldMapping[];
}
