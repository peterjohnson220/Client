import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { LogLevel } from '@microsoft/signalr';

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
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Error)
      .build();

    connection.start().then(function () {
      // connected
    });

    connection.on(HubMethodName.ReceiveNotification, (notification: AppNotification<any>) => {
        this.store.dispatch(new fromAppNotificationsActions.AddNotification(notification));
    });
  }
}
