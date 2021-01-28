import { UpsertPeerDataCutEntityConfigurationModel } from './upsert-peer-data-cut-entity-configuration.model';

export interface UpsertPeerDataCutModalConfiguration {
  CompanyJobId: number;
  CompanyPayMarketId: number;
  IsPayMarketOverride: boolean;
  CutGuid: string;
  EntityConfiguration: UpsertPeerDataCutEntityConfigurationModel;
  MapVisible: boolean;
}
