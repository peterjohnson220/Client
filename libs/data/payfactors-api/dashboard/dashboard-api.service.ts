import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DashboardTile } from '../../../models/dashboard';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class DashboardApiService {
  private endpoint = 'Dashboard';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getUserDashboardTiles(): Observable<DashboardTile[]> {
    return this.payfactorsApiService.get<DashboardTile[]>(`${this.endpoint}.GetUserTiles`);
  }
}
