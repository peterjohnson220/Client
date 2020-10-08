import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import { UserNotification } from '../../models';
import * as fromUserNotificationListReducers from '../../reducers/index';
import * as fromUserNotificationListActions from '../../actions/user-notification-list.actions';

@Component({
  selector: 'pf-user-notification-list',
  templateUrl: './user-notification-list.component.html',
  styleUrls: ['./user-notification-list.component.scss']
})
export class UserNotificationListComponent implements OnInit, OnDestroy {
  @Input() DisplayHeader = true;
  userNotificationsAsyncObj$: Observable<AsyncStateObj<UserNotification[]>>;

  modalNotification: UserNotification;
  userNotificationsFeatureFlag: RealTimeFlag = { key: FeatureFlags.UserNotifications, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<fromUserNotificationListReducers.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.userNotificationsAsyncObj$ = this.store.pipe(
      select(fromUserNotificationListReducers.getUserNotificationsAsyncObj)
    );
    this.featureFlagService.bindEnabled(this.userNotificationsFeatureFlag, this.unsubscribe$);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromUserNotificationListActions.GetUserNotifications());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  openNotification(notification: UserNotification): void {
    this.modalNotification = notification;
    if (!notification.IsRead) {
      this.store.dispatch(new fromUserNotificationListActions.MarkNotificationRead({ userNotificationId: notification.Id }));
    }
  }

  markAllAsRead(): void {
    this.store.dispatch(new fromUserNotificationListActions.MarkAllNotificationsRead());
  }

}
