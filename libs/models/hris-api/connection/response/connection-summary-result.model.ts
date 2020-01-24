import {ProviderResponse} from '../../provider/response';

export interface ConnectionSummaryResponse {
  statuses: string[];
  provider: ProviderResponse;
  hasConnection: boolean;
  canEditConnection: boolean;
  canEditMappings: boolean;
}
