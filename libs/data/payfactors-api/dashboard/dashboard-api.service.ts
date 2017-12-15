import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { UserTileDto } from '../../../models/dashboard';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class DashboardApiService {
  private endpoint = 'Dashboard';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getUserDashboardTiles(): Observable<UserTileDto[]> {
    return this.payfactorsApiService.get<UserTileDto[]>(`${this.endpoint}.GetUserTiles`);
  }
}
