import {LoaderFieldMapping} from './loader-field-mapping.model';

export interface LoaderFieldSet {
  CompanyId: number;
  LoaderType: string;
  LoaderFieldMappings: LoaderFieldMapping[];
}
