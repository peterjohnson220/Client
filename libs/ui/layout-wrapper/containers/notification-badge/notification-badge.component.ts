import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromAppNotificationsReducer from 'libs/features/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';

@Component({
  selector: 'pf-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss']
})
export class NotificationBadgeComponent implements OnInit {
  notificationCount$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromAppNotificationsReducer.State>) {
    this.notificationCount$ = store.select(fromAppNotificationsReducer.getUnreadCountAsyncObj).pipe(
      map(asyncObj => asyncObj.obj)
    );
    this.loading$ = store.select(fromAppNotificationsReducer.getUnreadCountAsyncObj).pipe(
      map(asyncObj => asyncObj.loading)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(new fromAppNotificationsActions.UpdateUserNotificationUnreadCount());
  }

}
