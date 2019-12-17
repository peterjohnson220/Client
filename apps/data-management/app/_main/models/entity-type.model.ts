import {OrgDataEntityType} from 'libs/constants/hris-api';

export interface EntityTypeModel {
  EntityType: OrgDataEntityType;
  EntityName: string;
}

export function generateMockEntityTypeModel(): EntityTypeModel {
  return {
    EntityType: OrgDataEntityType.Employees,
    EntityName: 'Employees'
  };
}
