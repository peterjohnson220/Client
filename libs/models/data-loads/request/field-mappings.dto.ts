import { MappingModel } from '../mapping.model';

export class FieldMappingsDTO {
  companyId: number;
  mappings: MappingModel[];
  loaderConfigurationGroupId?: number;
}
