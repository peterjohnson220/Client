import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})

export class OrganizationalDataApiService {
  private endpoint = 'OrganizationalData';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  getOrganizationalHeadersLink() {
    return this.payfactorsApiService.get(`${this.endpoint}/GetOrganizationalHeadersLink`);
  }

  downloadOrganizationalData(companyId: number) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetOrganizationalData/${companyId}`);
  }

}
