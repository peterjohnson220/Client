import { Injectable } from '@angular/core';

import { ActiveToast, ToastrService } from 'ngx-toastr';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as fromAppNotificationsActions from '../actions/app-notifications.actions';
import {
  AppNotification,
  NotificationHelper,
  NotificationLevel,
  NotificationPayload,
  NotificationSource,
  NotificationType,
  NotificationWithFilePayload,
  ProgressStatusPayload,
  SuccessStatusPayLoad
} from '../models';

@Injectable()
export class ToastsEffects {
  activeProgressToasts: any = {};

  @Effect({ dispatch: false })
  addNotification$ = this.action$
    .pipe(
      ofType(fromAppNotificationsActions.ADD_NOTIFICATION),
      tap((action: fromAppNotificationsActions.AddNotification) => {
        if (!action.payload.SuppressNotificationPopup) {
          this.handleReceiveNotification(action.payload);
        }
      })
    );

  private handleReceiveNotification(notification: AppNotification<any>) {
    switch (notification.Type) {
      case NotificationType.Event: {
        this.handleEventNotification(notification);
        break;
      }
      case NotificationType.Progress: {
        this.handleProgressNotification(notification);
        break;
      }
      case NotificationType.User: {
        this.handleEventNotification(notification);
        break;
      }
      default: {
        break;
      }
    }
  }

  private getNotificationDetails(notification: AppNotification<NotificationPayload>): any {
    let toastHasFile = false;
    let isGenericNotification = false;
    if (notification.From === NotificationSource.GenericNotificationMessage) {
      isGenericNotification = true;
      const messagePayload = notification.Payload as NotificationWithFilePayload;
      if (messagePayload.FileDownloadLink && messagePayload.FileDownloadLink.length > 0) {
        toastHasFile = true;
      }
    } else if (notification.Level === NotificationLevel.Success) {
      const successPayload = notification.Payload as SuccessStatusPayLoad;
      if (successPayload && successPayload.ExportedViewLink && successPayload.ExportedViewLink.length > 0) {
        toastHasFile = true;
      }
    }

    return { toastHasFile: toastHasFile, isGenericNotification: isGenericNotification };

  }

  private handleEventNotification(notification: AppNotification<NotificationPayload>): void {
    const eventMessage = this.notificationHelper.getEventMessage(notification);

    const notificationDetail = this.getNotificationDetails(notification);

    switch (notification.Level) {
      case NotificationLevel.Success: {
        this.closeProgressNotification(notification);

        const toastConfig = {
          enableHtml: notification.EnableHtml,
          tapToDismiss: true,
          disableTimeOut: false
        };

        // for a generic message with download link we want to prevent misclicks so they get the file
        if (notificationDetail.toastHasFile) {
          toastConfig.tapToDismiss = false;
          toastConfig.disableTimeOut = true;
        }

        this.toastr.success(eventMessage, notification.Payload.Title, toastConfig);
        break;
      }
      case NotificationLevel.Info: {

        const toastConfig = {
          enableHtml: notification.EnableHtml,
          timeOut: 5000
        };

        if (notificationDetail.isGenericNotification) {
          // request from PO to show for longer
          toastConfig.timeOut = 30000;
        }

        this.toastr.info(eventMessage, notification.Payload.Title, toastConfig);
        break;
      }
      case NotificationLevel.Warning: {
        this.toastr.warning(eventMessage, notification.Payload.Title, {
          enableHtml: notification.EnableHtml
        });
        break;
      }
      case NotificationLevel.Error: {
        this.closeProgressNotification(notification);
        this.toastr.error(eventMessage, notification.Payload.Title, {
          enableHtml: notification.EnableHtml
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  private handleProgressNotification(notification: AppNotification<ProgressStatusPayload>): void {
    const progressMessage = this.notificationHelper.getProgressMessage(notification);
    if (notification.NotificationId && this.activeProgressToasts[notification.NotificationId]) {
      const activeToast = this.activeProgressToasts[notification.NotificationId] as ActiveToast<any>;
      if (activeToast) {
        activeToast.toastRef.componentInstance.message = progressMessage;
      }
    } else {
      const toast = this.toastr.info(notification.Payload.Message, notification.Payload.Title, {
        enableHtml: true,
        disableTimeOut: true
      });
      toast.toastRef.componentInstance.message = progressMessage;
      if (notification.NotificationId) {
        this.activeProgressToasts[notification.NotificationId] = toast;
      }
    }
  }

  private closeProgressNotification(notification: AppNotification<any>): void {
    if (notification.NotificationId && this.activeProgressToasts[notification.NotificationId]) {
      const activeToast = this.activeProgressToasts[notification.NotificationId] as ActiveToast<any>;
      if (activeToast) {
        activeToast.toastRef.manualClose();
      }
    }
  }

  constructor(
    private action$: Actions,
    private toastr: ToastrService,
    private notificationHelper: NotificationHelper
  ) { }
}
