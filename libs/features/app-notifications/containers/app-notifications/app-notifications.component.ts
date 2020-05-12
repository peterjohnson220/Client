import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as signalR from '@aspnet/signalr';
import { LogLevel } from '@aspnet/signalr';

import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';

import * as fromAppNotificationsMainReducer from '../../reducers';
import * as fromAppNotificationsActions from '../../actions/app-notifications.actions';
import { HubMethodName, AppNotification } from '../../models';

@Component({
  selector: 'pf-app-notifications',
  templateUrl: './app-notifications.component.html',
  styleUrls: ['./app-notifications.component.scss']
})
export class AppNotificationsComponent implements OnInit, OnDestroy {

  userContext$: Observable<UserContext>;

  userContextSub: Subscription;

  notifications: AppNotification<any>[];
  signalRConnectionUrl: string;
  retryCount = 0;

  constructor(
    private store: Store<fromAppNotificationsMainReducer.State>
  ) {
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit(): void {
    this.userContextSub = this.userContext$.subscribe(userContext => {
      if (!userContext || userContext.IsPublic || !!userContext.WorkflowStepInfo ) {
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
  }

  private initHubConnection(): void {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(this.signalRConnectionUrl)
      .configureLogging(LogLevel.None)
      .build();

    this.startConnection(connection);

    connection.on(HubMethodName.ReceiveNotification, (notification: AppNotification<any>) => {
        this.store.dispatch(new fromAppNotificationsActions.AddNotification(notification));
    });

    connection.onclose(() => {
      this.startConnection(connection);
    });
  }

  private startConnection(connection: any) {
    const that = this;
    if (this.retryCount <= 3) {
      connection.start().then(function () {
        that.retryCount = 0;
      }).catch(function (error) {
        if (error && error.statusCode !== 401) {
          setTimeout(() => {
            that.retryCount++;
            that.startConnection(connection);
          }, 5000 * that.retryCount);
        }
      });
    }
  }
}
