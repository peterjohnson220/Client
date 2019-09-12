import { Component, OnInit, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { ToastrService } from 'ngx-toastr';

import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';

import * as fromAppNotificationsMainReducer from '../../reducers';
import { HubMethodName, AppNotification, NotificationType, NotificationLevel } from '../../models';

@Component({
  selector: 'pf-app-notifications',
  templateUrl: './app-notifications.component.html',
  styleUrls: ['./app-notifications.component.scss']
})
export class AppNotificationsComponent implements OnInit, OnDestroy {

  userContext$: Observable<UserContext>;
  notifications$: Observable<AppNotification[]>;

  userContextSub: Subscription;
  notificationsSub: Subscription;

  notifications: AppNotification[];
  signalRConnectionUrl: string;

  constructor(
    private store: Store<fromAppNotificationsMainReducer.State>,
    private toastr: ToastrService
  ) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.notifications$ = this.store.pipe(select(fromAppNotificationsMainReducer.getNotifications));
  }

  ngOnInit(): void {
    this.notificationsSub = this.notifications$.subscribe(results => this.notifications = results);
    this.userContextSub = this.userContext$.subscribe(userContext => {
      if (!userContext) {
        return;
      }
      this.signalRConnectionUrl = userContext.ConfigSettings.find(c => c.Name === 'SignalR').Value;
      const signalREnabled = userContext.ConfigSettings.find(c => c.Name === 'SignalREnabled').Value;
      if (signalREnabled === 'true' && !!this.signalRConnectionUrl) {
        this.signalRConnectionUrl = `${this.signalRConnectionUrl}/notifications`;
        this.initHubConnection();
      }
    });
  }

  ngOnDestroy(): void {
    this.userContextSub.unsubscribe();
    this.notificationsSub.unsubscribe();
  }

  private initHubConnection(): void {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(this.signalRConnectionUrl)
      .build();

    connection.start().then(function () {
    }).catch(function (err) {
      return console.error(err.toString());
    });

    connection.on(HubMethodName.ReceiveNotification, (notification: AppNotification) => {
      this.handleReceiveNotification(notification);
    });
  }

  private handleReceiveNotification(notification: AppNotification) {
    switch (notification.Type) {
      case NotificationType.Event: {
        this.handleEventNotification(notification);
        break;
      }
      default: {
        break;
      }
    }
  }

  private handleEventNotification(notification: AppNotification): void {
    switch (notification.Level) {
      case NotificationLevel.Success: {
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
}
