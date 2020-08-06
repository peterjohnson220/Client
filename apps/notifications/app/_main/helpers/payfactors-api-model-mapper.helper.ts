import { DataViewExportResponse } from 'libs/models/payfactors-api/reports/response';
import { UserNotificationResponse } from 'libs/models/payfactors-api/notifications';

import { DataViewExport, UserNotification } from '../models';

export class PayfactorsApiModelMapper {
  static mapDataViewExportResponsesToDataViewExports(response: DataViewExportResponse[]): DataViewExport[] {
    return response.map(e => {
      return {
        UserDataViewId: e.UserDataViewId,
        EventId: e.EventId,
        ReportName: e.ReportName,
        FileName: e.FileName,
        ExportUrl: e.ExportUrl,
        DownloadDate: e.CreateDate,
      };
    });
  }

  static mapUserNotificationResponsesUserNotifications(response: UserNotificationResponse[]): UserNotification[] {
    return response.map(e => {
      return {
        Id: e.Id,
        UserId: e.UserId,
        NotificationId: e.NotificationId,
        NotificationCategoryId: e.NotificationCategoryId,
        NotificationLevel: e.NotificationLevel,
        Title: e.Title,
        Message: e.Message,
        EnableHtml: e.EnableHtml,
        IsRead: e.IsRead,
        ShowBadge: e.ShowBadge,
        CreateDate: e.CreateDate
      };
    });
  }
}
