import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromAppNotificationsReducer from 'libs/features/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import * as fromLibsUserNotificationStore from 'libs/features/user-notifications/reducers';
import * as fromLibsUserNotificationActions from 'libs/features/user-notifications/actions/user-notification-list.actions';

@Component({
  selector: 'pf-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss']
})
export class NotificationBadgeComponent implements OnInit {
  notificationCount$: Observable<number>;

  constructor(private store: Store<fromAppNotificationsReducer.State>,
              private userNotificationStore: Store<fromLibsUserNotificationStore.State>) {
    this.notificationCount$ = store.select(fromAppNotificationsReducer.getUnseenCountAsyncObj).pipe(
      map(asyncObj => asyncObj.obj)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(new fromAppNotificationsActions.UpdateUserNotificationsUnseenCount());
  }

  markAllNotificationsAsSeen() {
    this.userNotificationStore.dispatch(new fromLibsUserNotificationActions.MarkAllNotificationsSeen());
  }
}
