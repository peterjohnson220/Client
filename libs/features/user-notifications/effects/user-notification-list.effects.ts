import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';

import { NotificationsApiService } from 'libs/data/payfactors-api';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { PayfactorsApiModelMapper } from 'libs/features/user-notifications/helpers';

import * as fromUserNotificationListActions from '../actions/user-notification-list.actions';
import { UserNotification } from '../models';

@Injectable()
export class UserNotificationListEffects {

  @Effect()
  getUserNotifications$ = this.actions$
    .pipe(
      ofType(fromUserNotificationListActions.GET_USER_NOTIFICATIONS),
      switchMap(() => {
        return this.notificationApiService.getUserNotifications()
          .pipe(
            map((response) => {
              const userNotifications: UserNotification[] = PayfactorsApiModelMapper.mapUserNotificationResponsesUserNotifications(response);
              return new fromUserNotificationListActions.GetUserNotificationsSuccess(userNotifications);
            }),
            catchError(() => of(new fromUserNotificationListActions.GetUserNotificationsError()))
          );
      })
    );

  @Effect()
  markNotificationRead$ = this.actions$
    .pipe(
      ofType<fromUserNotificationListActions.MarkNotificationRead>(fromUserNotificationListActions.MARK_NOTIFICATION_READ),
      switchMap((action) => {
        return this.notificationApiService.markNotificationAsRead(action.payload.userNotificationId).pipe(
          mergeMap(response => [new fromUserNotificationListActions.GetUserNotifications(),
            new fromAppNotificationsActions.UpdateUserNotificationUnreadCount(),
            new fromUserNotificationListActions.MarkNotificationReadSuccess()]),
          catchError(() => of(new fromUserNotificationListActions.MarkNotificationReadError()))
        );
      })
    );

  @Effect()
  markAllNotificationsRead$ = this.actions$
    .pipe(
      ofType<fromUserNotificationListActions.MarkAllNotificationsRead>(fromUserNotificationListActions.MARK_ALL_NOTIFICATIONS_READ),
      switchMap((action) => {
        return this.notificationApiService.markAllNotificationsAsRead().pipe(
          mergeMap(response => [new fromUserNotificationListActions.GetUserNotifications(),
            new fromAppNotificationsActions.UpdateUserNotificationUnreadCount(),
            new fromUserNotificationListActions.MarkAllNotificationsReadSuccess()]),
          catchError(() => of(new fromUserNotificationListActions.MarkAllNotificationsReadError()))
        );
      })
    );

  @Effect()
  markAllNotificationsSeen$ = this.actions$
    .pipe(
      ofType<fromUserNotificationListActions.MarkAllNotificationsSeen>(fromUserNotificationListActions.MARK_ALL_NOTIFICATIONS_SEEN),
      switchMap((action) => {
        return this.notificationApiService.markAllNotificationsAsSeen().pipe(
          mergeMap(response => [new fromUserNotificationListActions.GetUserNotifications(),
            new fromAppNotificationsActions.ClearUserNotificationUnseenCount(),
            new fromUserNotificationListActions.MarkAllNotificationsSeenSuccess()]),
          catchError(() => of(new fromUserNotificationListActions.MarkAllNotificationsSeenError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private notificationApiService: NotificationsApiService
  ) {}
}
