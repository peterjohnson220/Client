import { Injectable } from '@angular/core';

import { PayfactorsEntityFieldsResponse, MappingPackage, MappingPayload } from 'libs/models/hris-api/mapping';
import { ProviderEntitiyFieldsResponse } from 'libs/models/hris-api/mapping/response/provider-entity-field-response.model';
import { UserContext } from 'libs/models/security';

import { HrisApiService } from '../hris-api.service';

const UTILITIES_SUB_DOMAIN_CONFIG_NAME = 'UtilitiesSubDomain';

@Injectable()
export class MappingsHrisApiService {
  private endpoint = 'mappings';

  constructor(private hrisApiService: HrisApiService) {

  }

  getPayfactorsFields(userContext: UserContext, entity: string) {
    const host = this.getHost(userContext);

    return this.hrisApiService.get<PayfactorsEntityFieldsResponse>(`${host}${this.endpoint}/${userContext.CompanyId}/payfactorsfields/${entity}`);
  }

  getProviderFields(userContext: UserContext, entity: string) {
    const host = this.getHost(userContext);

    return this.hrisApiService.get<ProviderEntitiyFieldsResponse>(`${host}${this.endpoint}/${userContext.CompanyId}/providerfields/${entity}`);
  }

  saveMappingFields(userContext: UserContext, mappingPackage: MappingPackage) {
    const host = this.getHost(userContext);

    return this.hrisApiService.post<any>(`${host}${this.endpoint}/${userContext.CompanyId}/save`, mappingPackage);
  }

  getMappedFields(userContext: UserContext) {
    const host = this.getHost(userContext);

    return this.hrisApiService.get<MappingPackage>(`${host}${this.endpoint}/${userContext.CompanyId}/mappedfields`);
  }

  private getHost(userContext: UserContext): string {
    const utilitiesSubDomainConfig = userContext.ConfigSettings.find(config => config.Name === UTILITIES_SUB_DOMAIN_CONFIG_NAME);
    if (!utilitiesSubDomainConfig || !utilitiesSubDomainConfig.Value) {
      throw new Error('Configuration error: Missing utilities subdomain configuration');
    }

    return `https://${utilitiesSubDomainConfig.Value}.payfactors.com/hris-api/`;
  }
}
