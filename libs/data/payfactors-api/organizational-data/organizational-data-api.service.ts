import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()

export class OrganizationalDataApiService {
  private endpoint = 'OrganizationalData';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  getOrganizationalHeadersLink() {
    return this.payfactorsApiService.get(`${this.endpoint}/GetOrganizationalHeadersLink`);
  }

}
