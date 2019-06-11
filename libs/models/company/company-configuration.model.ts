import { CompanyClientTypeConstants } from '../../constants/company-client-type';
import { SystemUserGroupNames } from '../../constants/system-user-group-names';

export interface CompanyConfiguration<TKey, TUpdateValue> {
  ConfigKey: string;
  UpdateValues: UpdateValues<TKey, TUpdateValue>[];
  EnabledKeys: TKey[];
  DisabledKeys: TKey[];
  DisableBehavior: CompanyConfigurationDisableBehavior;
}

export interface UpdateValues<TKey, TUpdateValue> {
  UpdateValue: TUpdateValue;
  UpdateKey: TKey;
}

export enum CompanyConfigurationDisableBehavior {
  All,
  None,
  AllNotUpdated,
  Specified
}

export class CompanyConfigurationKeys {
    public static PEER_AND_ANALYSIS_CONFIG = `ClientType_${CompanyClientTypeConstants.PEER_AND_ANALYSIS}`;
    public static PEER_ONLY_CONFIG = `SystemUserGroup_${SystemUserGroupNames.PeerOnly}`;
}
