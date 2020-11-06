import { ExchangeStatCompanyMakeup, generateMockExchangeStatCompanyMakeup } from '../exchange-map-response.model';
import { BaseExchangeDataSearchRequest } from '../../payfactors-api/peer/exchange-data-search/request';
import { UpsertPeerDataCutEntityConfigurationModel } from '../../../features/upsert-peer-data-cut/models';
import { UpsertPeerDataCutEntities, UpsertPeerDataCutParentEntities } from '../../../features/upsert-peer-data-cut/constants';

export interface UpsertDataCutRequest {
  DataCutGuid: string;
  CompanyJobId: number | null;
  EntityConfiguration: UpsertPeerDataCutEntityConfigurationModel;
  CompanyPayMarketId: number;
  IsPayMarketOverride: boolean;
  Filter: BaseExchangeDataSearchRequest;
  ZoomLevel: number;
  PayMarketName: string;
  Companies: ExchangeStatCompanyMakeup[];
}

export function generateMockUpsertDataCutRequest(): UpsertDataCutRequest {
  return {
    DataCutGuid: 'MockGUID',
    CompanyJobId: null,
    EntityConfiguration: {
      BaseEntity: UpsertPeerDataCutEntities.ProjectJobs,
      BaseEntityId: 0,
      ParentEntity: UpsertPeerDataCutParentEntities.Projects,
      ParentEntityId: null
    },
    CompanyPayMarketId: 1,
    IsPayMarketOverride: false,
    Filter: {} as BaseExchangeDataSearchRequest,
    ZoomLevel: 1,
    PayMarketName: 'MockPayMarket',
    Companies: [generateMockExchangeStatCompanyMakeup()]
  };
}
