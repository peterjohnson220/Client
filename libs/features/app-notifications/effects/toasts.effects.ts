import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { ActiveToast, ToastrService } from 'ngx-toastr';

import * as fromAppNotificationsActions from '../actions/app-notifications.actions';

import { AppNotification, NotificationLevel, NotificationPayload, NotificationType, ProgressStatusPayload, NotificationHelper } from '../models';

@Injectable()
export class ToastsEffects {
  activeProgressToasts: any = {};

  @Effect({ dispatch: false })
  addNotification$ = this.action$
    .pipe(
      ofType(fromAppNotificationsActions.ADD_NOTIFICATION),
      tap((action: fromAppNotificationsActions.AddNotification) => {
        this.handleReceiveNotification(action.payload);
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
      default: {
        break;
      }
    }
  }

  private handleEventNotification(notification: AppNotification<NotificationPayload>): void {
    const eventMessage = this.notificationHelper.getEventMessage(notification);
    switch (notification.Level) {
      case NotificationLevel.Success: {
        this.closeProgressNotification(notification);
        this.toastr.success(eventMessage, notification.Payload.Title, {
          enableHtml: notification.EnableHtml,
          disableTimeOut: true
        });
        break;
      }
      case NotificationLevel.Info: {
        this.toastr.info(eventMessage, notification.Payload.Title, {
          enableHtml: notification.EnableHtml
        });
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
  ) {}
}
