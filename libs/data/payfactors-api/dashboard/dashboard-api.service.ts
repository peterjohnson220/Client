import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { PayfactorsApiService } from '../payfactors-api.service';

import { ReorderTileRequest, UserTileDto } from '../../../models/dashboard';

@Injectable()
export class DashboardApiService {
  private endpoint = 'Dashboard';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getUserDashboardTiles(): Observable<UserTileDto[]> {
    return this.payfactorsApiService.get<UserTileDto[]>(`${this.endpoint}.GetUserTiles`, { params: { getTilePreviewData: true } });
  }

  reorderDashboardTiles(request: ReorderTileRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ReArrangeTile`,
      {
        movedUserTileId: request.movedUserTileId,
        newNextUserTileId: request.newNextUserTileId
      }
    );
  }
}
