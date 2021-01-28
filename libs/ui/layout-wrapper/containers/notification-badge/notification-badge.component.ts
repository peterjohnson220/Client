import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromAppNotificationsReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromLibsUserNotificationStore from 'libs/features/infrastructure/user-notifications/reducers';
import * as fromLibsUserNotificationActions from 'libs/features/infrastructure/user-notifications/actions/user-notification-list.actions';
import { UserNotificationEventHelperService } from 'libs/features/infrastructure/user-notifications/helpers/user-notification-event-helper-service';

@Component({
  selector: 'pf-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss']
})
export class NotificationBadgeComponent implements OnInit {
  @ViewChild('p') popover: NgbPopover;
  notificationCount$: Observable<number>;

  constructor(private store: Store<fromAppNotificationsReducer.State>,
              private userNotificationStore: Store<fromLibsUserNotificationStore.State>,
              private userNotificationEventHelperService: UserNotificationEventHelperService) {
    this.notificationCount$ = store.select(fromAppNotificationsReducer.getUnseenCountAsyncObj).pipe(
      map(asyncObj => asyncObj.obj)
    );

    this.userNotificationEventHelperService.closePopover$.subscribe(x => {
      this.popover.close();
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new fromAppNotificationsActions.UpdateUserNotificationsUnseenCount());
  }

  markAllNotificationsAsSeen() {
    this.userNotificationStore.dispatch(new fromLibsUserNotificationActions.MarkAllNotificationsSeen());
  }
}
