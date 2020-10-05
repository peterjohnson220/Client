import { generateMockProvider, Provider } from './provider.model';
import { OrgDataEntityType } from 'libs/constants';

export interface ConnectionSummary {
  connectionID?: number;
  statuses: string[];
  provider: Provider;
  hasConnection: boolean;
  canEditConnection: boolean;
  canEditMappings: boolean;
  selectedEntities: OrgDataEntityType[];
  loaderConfigurationGroupId?: number;
  validationMode: boolean;
  fullReplaceModes?: FullReplaceModes;
}

export interface FullReplaceModes {
  EmployeesFullReplace: string;
  StructureMappingsFullReplace: string;
}

export function generateMockExistingConnectionSummary(): ConnectionSummary {
  return {
    connectionID: 123,
    provider: generateMockProvider(),
    canEditConnection: false,
    canEditMappings: false,
    hasConnection: false,
    selectedEntities: [OrgDataEntityType.Employees],
    statuses: [],
    loaderConfigurationGroupId: 12345,
    validationMode: false,
  };
}

export function generateMockNewConnectionSummary(): ConnectionSummary {
  return {
    provider: null,
    canEditConnection: false,
    canEditMappings: false,
    hasConnection: false,
    selectedEntities: [],
    statuses: [],
    loaderConfigurationGroupId: 12345,
    validationMode: true,
  };
}
