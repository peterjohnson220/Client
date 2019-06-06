import { LoaderFieldMapping } from './loader-field-mapping.model';
import { LoaderType } from '../constants/loader-type.enum';

export interface LoaderFieldSet {
  CompanyId: number;
  LoaderType: LoaderType;
  LoaderFieldMappings: LoaderFieldMapping[];
}
