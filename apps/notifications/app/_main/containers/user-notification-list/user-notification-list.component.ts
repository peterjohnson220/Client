import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import { UserNotification } from '../../models';
import * as fromNotificationsMainReducer from '../../reducers';
import * as fromUserNotificationListActions from '../../actions/user-notification-list.actions';

@Component({
  selector: 'pf-user-notification-list',
  templateUrl: './user-notification-list.component.html',
  styleUrls: ['./user-notification-list.component.scss']
})
export class UserNotificationListComponent implements OnInit, OnDestroy {
  userNotificationsAsyncObj$: Observable<AsyncStateObj<UserNotification[]>>;

  modalNotification: UserNotification;
  showModal: BehaviorSubject<boolean>;
  showModal$: Observable<boolean>;
  userNotificationsFeatureFlag: RealTimeFlag = { key: FeatureFlags.UserNotifications, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(
    private store: Store<fromNotificationsMainReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.userNotificationsAsyncObj$ = this.store.pipe(
      select(fromNotificationsMainReducer.getUserNotificationsAsyncObj)
    );
    this.showModal = new BehaviorSubject<boolean>(false);
    this.showModal$ = this.showModal.asObservable();
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
    this.showModal.next(true);
  }

  markAllAsRead(): void {
    this.store.dispatch(new fromUserNotificationListActions.MarkAllNotificationsRead());
  }

}
