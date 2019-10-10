import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { ActiveToast, ToastrService } from 'ngx-toastr';

import * as fromAppNotificationsActions from '../actions/app-notifications.actions';

import { AppNotification, NotificationLevel, NotificationPayload, NotificationType, ProgressStatusPayload } from '../models';

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
    switch (notification.Level) {
      case NotificationLevel.Success: {
        this.closeProgressNotification(notification);
        this.toastr.success(notification.Payload.Message, notification.Payload.Title, {
          enableHtml: notification.EnableHtml,
          disableTimeOut: true
        });
        break;
      }
      case NotificationLevel.Info: {
        this.toastr.info(notification.Payload.Message, notification.Payload.Title, {
          enableHtml: notification.EnableHtml
        });
        break;
      }
      case NotificationLevel.Warning: {
        this.toastr.warning(notification.Payload.Message, notification.Payload.Title, {
          enableHtml: notification.EnableHtml
        });
        break;
      }
      case NotificationLevel.Error: {
        this.closeProgressNotification(notification);
        this.toastr.error(notification.Payload.Message, notification.Payload.Title, {
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
    const progressMessage = this.addProgressBar(notification.Payload.Message, notification.Payload);
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

  private addProgressBar(message: string, progress: ProgressStatusPayload): SafeHtml {
    let progressClasses = 'progress-bar-animated bg-info';
    if (progress.PercentageComplete === 100) {
      progressClasses = 'bg-success';
    }
    const progressBar = `
        <div class="progress">
          <div class="progress-bar progress-bar-striped ${progressClasses}" role="progressbar"
          style="width: ${progress.PercentageComplete}%">
          </div>
        </div>`;
    return this.sanitizer.bypassSecurityTrustHtml(message + progressBar);
  }

  constructor(
    private action$: Actions,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}
}
