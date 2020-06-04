import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum, AsyncStateObj } from 'libs/models';

import { UserNotification } from '../../models';
import * as fromNotificationsMainReducer from '../../reducers';
import * as fromUserNotificationListActions from '../../actions/user-notification-list.actions';

@Component({
  selector: 'pf-user-notification-list',
  templateUrl: './user-notification-list.component.html',
  styleUrls: ['./user-notification-list.component.scss']
})
export class UserNotificationListComponent implements OnInit {
  enableUserNotifications$: Observable<boolean>;
  userNotificationsAsyncObj$: Observable<AsyncStateObj<UserNotification[]>>;

  modalNotification: UserNotification;
  showModal: BehaviorSubject<boolean>;
  showModal$: Observable<boolean>;

  constructor(
    private store: Store<fromNotificationsMainReducer.State>,
    private settingService: SettingsService
  ) {
    this.enableUserNotifications$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableUserNotifications
    );
    this.userNotificationsAsyncObj$ = this.store.pipe(
      select(fromNotificationsMainReducer.getUserNotificationsAsyncObj)
    );
    this.showModal = new BehaviorSubject<boolean>(false);
    this.showModal$ = this.showModal.asObservable();
  }

  ngOnInit(): void {
    this.store.dispatch(new fromUserNotificationListActions.GetUserNotifications());
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
