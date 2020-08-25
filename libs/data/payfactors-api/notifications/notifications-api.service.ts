import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataViewExportResponse } from 'libs/models/payfactors-api/reports/response';
import { UserNotificationResponse } from 'libs/models/payfactors-api/notifications';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class NotificationsApiService {
  private endpoint = 'Notification';

  constructor(private payfactorsApiService: PayfactorsApiService) {}

  getDataViewsExports(): Observable<DataViewExportResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDataViewsExportRecords`);
  }

  getTotalRewardsStatementPdfs(): Observable<any[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetTotalRewardsStatementPdfs`);
  }

  getUserNotifications(): Observable<UserNotificationResponse[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserNotifications`);
  }

  getUserNotificationUnreadCount(): Observable<number> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetUserNotificationUnreadBadgeCount`);
  }

  markNotificationAsRead(userNotificationId: number): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/MarkNotificationAsRead/${userNotificationId}`, {}, () => true);
  }

  markAllNotificationsAsRead(): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/MarkAllNotificationsAsRead`, {}, () => true);
  }
}
