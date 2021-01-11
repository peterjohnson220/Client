import { FieldMapping } from '../../features/org-data-loader/models';

export interface MappingModel {
  LoaderType: string;
  Mappings: FieldMapping[];
}
