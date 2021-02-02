import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})

export class SiteAdminApiService {
  private endpoint = 'SiteAdminRoute';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getRepositoriesByRoute(routeName: string) {
    return this.payfactorsApiService.get<number[]>(`${this.endpoint}/GetRepositoriesByRoute?routeName=${routeName}`);
  }
}
