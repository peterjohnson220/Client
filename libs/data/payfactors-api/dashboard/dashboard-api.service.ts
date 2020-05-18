import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';

import { UserFeatureDto, ReorderTileRequest, UserTileDto, TimelineActivityRequest } from '../../../models/dashboard';

@Injectable()
export class DashboardApiService {
  private endpoint = 'Dashboard';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  getUserDashboardTiles(includeTilePreviewData: boolean): Observable<UserTileDto[]> {
    return this.payfactorsApiService.get<UserTileDto[]>
    (`${this.endpoint}.GetUserTiles`, { params: { includeTilePreviewData: includeTilePreviewData } });
  }

  getUserDashboardTile(tileId: number): Observable<UserTileDto> {
    return this.payfactorsApiService.get<UserTileDto>
    (`${this.endpoint}.GetUserTile`, { params: { userTileId: tileId } });
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

  getIsJdmEnabled(): Observable<boolean> {
    return this.payfactorsApiService.get<boolean>(`${this.endpoint}.IsJdmEnabled`);
  }

  sendInAppMarketingEmail(tileName: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}.SendInAppMarketingEmail`,
      {
        tileType: tileName
      });
  }

  getDriftUserId(pfAccountExecutiveUserId: number): Observable<any> {
    return this.payfactorsApiService.get<number>(`${this.endpoint}.GetDriftUserId`, { params: { userId: pfAccountExecutiveUserId } });
  }

  saveDashboardPreferences(userTiles: UserTileDto[]): Observable<any> {
    return this.payfactorsApiService.post<UserTileDto[]>(`${this.endpoint}.SaveDashboardPreferences`,
      {
        UserTile: userTiles
      });
  }
}
