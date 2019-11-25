import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import {CompanyDto} from '../../../models/company';


@Injectable()

export class OrganizationalDataApiService {
  private endpoint = 'OrganizationalData';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getOrganizationalHeadersLink() {
    return this.payfactorsApiService.get(`${this.endpoint}/GetOrganizationalHeadersLink`);
  }
}
