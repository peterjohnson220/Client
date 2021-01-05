import { Component, Input, OnDestroy, OnInit, TrackByFunction } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import { UserNotification } from '../../models';
import * as fromUserNotificationListReducers from '../../reducers';
import * as fromUserNotificationListActions from '../../actions/user-notification-list.actions';

@Component({
  selector: 'pf-user-notification-list',
  templateUrl: './user-notification-list.component.html',
  styleUrls: ['./user-notification-list.component.scss']
})
export class UserNotificationListComponent implements OnInit, OnDestroy {
  @Input() DisplayHeader = true;

  userNotifications$: Observable<UserNotification[]>;
  unsubscribe$ = new Subject<void>();

  modalNotification: UserNotification;
  userNotifications: UserNotification[];
  userNotificationsFeatureFlag: RealTimeFlag = { key: FeatureFlags.UserNotifications, value: false };
  scrollId: string;

  trackByUserNotificationId: TrackByFunction<UserNotification> = (index: number, userNotification: UserNotification) => userNotification.Id;

  constructor(
    private store: Store<fromUserNotificationListReducers.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.scrollId = ScrollIdConstants.USER_NOTIFICATIONS;
    this.userNotifications$ = this.store.pipe(select(fromUserNotificationListReducers.getUserNotifications));
    this.featureFlagService.bindEnabled(this.userNotificationsFeatureFlag, this.unsubscribe$);
  }

  get numberOfCurrentResults(): number {
    return this.userNotifications?.length ?? 0;
  }

  ngOnInit(): void {
    this.store.dispatch(new fromUserNotificationListActions.GetUserNotifications());
    this.userNotifications$.pipe(takeUntil(this.unsubscribe$)).subscribe((userNotifications) => {
      this.userNotifications = userNotifications ?? [];
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
