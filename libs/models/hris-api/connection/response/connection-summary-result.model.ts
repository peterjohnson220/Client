import {ProviderResponse} from '../../provider/response';

export interface ConnectionSummaryResponse {
  connection_ID?: number;
  statuses: string[];
  provider: ProviderResponse;
  hasConnection: boolean;
  canEditConnection: boolean;
  canEditMappings: boolean;
  selectedEntities: string[];
  loaderConfigurationGroupId?: number;
}
