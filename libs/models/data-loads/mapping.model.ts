import { FieldMapping } from '../../features/loaders/org-data-loader/models';

export interface MappingModel {
  LoaderType: string;
  Mappings: FieldMapping[];
}
