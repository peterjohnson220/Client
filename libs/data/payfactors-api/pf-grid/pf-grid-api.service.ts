import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { PfGridColumnModel } from '../../../models/common/pf-grid';

@Injectable()
export class PfGridApiService {
  private endpoint = 'PfGrid';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getDefaultColumns(entity: string) {
    return this.payfactorsApiService.get<PfGridColumnModel[]>(this.endpoint + `.GetDefaultColumns?entity=${entity}`);
  }
}
