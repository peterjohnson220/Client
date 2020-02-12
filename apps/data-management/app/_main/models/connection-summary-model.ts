import {generateMockProvider, Provider} from './provider.model';

export interface ConnectionSummary {
  connectionID?: number;
  statuses: string[];
  provider: Provider;
  hasConnection: boolean;
  canEditConnection: boolean;
  canEditMappings: boolean;
  selectedEntities: string[];
}

export function generateMockExistingConnectionSummary(): ConnectionSummary {
  return {
    connectionID: 123,
    provider: generateMockProvider(),
    canEditConnection: false,
    canEditMappings: false,
    hasConnection: false,
    selectedEntities: [],
    statuses: [],
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
  };
}
