import {Provider} from './provider.model';

export interface ConnectionSummary {
  statuses: string[];
  provider: Provider;
  hasConnection: boolean;
  canEditConnection: boolean;
  canEditMappings: boolean;
  selectedEntities: string[];
}
