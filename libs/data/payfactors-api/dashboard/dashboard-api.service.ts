import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { PayfactorsApiService } from '../payfactors-api.service';

import { UserFeatureDto, ReorderTileRequest, UserTileDto } from '../../../models/dashboard';

import { TimelineActivityRequest } from '../../../models/dashboard/timeline-activity-request.model';


@Injectable()
export class DashboardApiService {
  private endpoint = 'Dashboard';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getUserDashboardTiles(includeTilePreviewData: boolean): Observable<UserTileDto[]> {
    return this.payfactorsApiService.get<UserTileDto[]>
    (`${this.endpoint}.GetUserTiles`, { params: { includeTilePreviewData: includeTilePreviewData } });
  }

  getUserDashboardTile(tileId: number): Observable<UserTileDto[]> {
    return this.payfactorsApiService.get<UserTileDto[]>
    (`${this.endpoint}.GetUserTile`, { params: { tileId: tileId } });
  }

  reorderDashboardTiles(request: ReorderTileRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.ReArrangeTile`,
      {
        movedUserTileId: request.movedUserTileId,
        newNextUserTileId: request.newNextUserTileId
      }
    );
  }

  getUserFeatures(): Observable<UserFeatureDto[]> {
    return this.payfactorsApiService.get<UserFeatureDto[]>(`${this.endpoint}.GetUserFeatures`);
  }

  getTimelineActivities(request: TimelineActivityRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.GetTimelineActivity`,
      {
        page: request.Page,
        recordsPerPage: request.RecordsPerPage,
        typesToRetrieve: request.TypesToRetrieve
      });
  }
}
