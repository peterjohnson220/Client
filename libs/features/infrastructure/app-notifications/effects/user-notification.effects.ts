import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { NotificationsApiService } from 'libs/data/payfactors-api';

import { NotificationType } from '../models';
import * as fromAppNotificationsActions from '../actions/app-notifications.actions';

@Injectable()
export class UserNotificationEffects {

  @Effect()
  updateUnreadCountForUserNotifications$ = this.action$
    .pipe(
      ofType<fromAppNotificationsActions.AddNotification>(fromAppNotificationsActions.ADD_NOTIFICATION),
      filter(action => action.payload.Type === NotificationType.User),
      map(action => new fromAppNotificationsActions.UpdateUserNotificationsUnseenCount())
    );

  @Effect()
  updateUnreadCount$ = this.action$
    .pipe(
      ofType<fromAppNotificationsActions.UpdateUserNotificationUnreadCount>(fromAppNotificationsActions.UPDATE_USER_NOTIFICATION_UNREAD_COUNT),
      switchMap(action => {
        return this.notificationsApiService.getUserNotificationUnreadCount().pipe(
          map(unreadCount => new fromAppNotificationsActions.UpdateUserNotificationUnreadCountSuccess({ notificationCount: unreadCount })),
          catchError(() => of(new fromAppNotificationsActions.UpdateUserNotificationUnreadCountError()))
        );
      })
    );

  @Effect()
  updateUnseenCount$ = this.action$
    .pipe(
      ofType<fromAppNotificationsActions.UpdateUserNotificationsUnseenCount>(fromAppNotificationsActions.UPDATE_USER_NOTIFICATION_UNSEEN_COUNT),
      switchMap(action => {
        return this.notificationsApiService.getUserNotificationUnseenCount().pipe(
          map(unreadCount => new fromAppNotificationsActions.UpdateUserNotificationUnseenCountSuccess({ notificationCount: unreadCount })),
          catchError(() => of(new fromAppNotificationsActions.UpdateUserNotificationUnseenCountError()))
        );
      })
    );

  constructor(
    private action$: Actions,
    private notificationsApiService: NotificationsApiService
  ) { }
}
