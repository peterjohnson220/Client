import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';

import { NotificationsApiService } from 'libs/data/payfactors-api';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromInfiniteScrollActions from 'libs/features/search/infinite-scroll/actions/infinite-scroll.actions';
import { PayfactorsApiModelMapper } from 'libs/features/infrastructure/user-notifications/helpers';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models/scroll-id.constants';
import { InfiniteScrollActionContext, InfiniteScrollEffectsService } from 'libs/features/search/infinite-scroll/services';

import * as fromUserNotificationListActions from '../actions/user-notification-list.actions';
import * as fromUserNotificationReducer from '../reducers';
import { UserNotification } from '../models';
import { UserNotificationEventHelperService } from '../helpers/user-notification-event-helper-service';

@Injectable()
export class UserNotificationListEffects {

  @Effect()
  getUserNotifications$ = this.actions$.pipe(
    ofType<fromUserNotificationListActions.GetUserNotifications>(fromUserNotificationListActions.GET_USER_NOTIFICATIONS),
    map(() => new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.USER_NOTIFICATIONS, pageSize: 10}))
  );

  @Effect()
  infiniteScrollUserNotifications$ = this.infiniteScrollEffectsService.infiniteScrollActions$(ScrollIdConstants.USER_NOTIFICATIONS)
    .pipe(
      switchMap((infiniteScrollActionContext: InfiniteScrollActionContext) => {
        return this.notificationApiService.getUserNotifications(infiniteScrollActionContext.pagingOptions)
          .pipe(
            map((response) => {
              const userNotifications: UserNotification[] = PayfactorsApiModelMapper.mapUserNotificationResponsesUserNotifications(response);

              infiniteScrollActionContext.scrollSuccessful(this.store, userNotifications);

              return new fromUserNotificationListActions.SetUserNotifications({
                replaceAll: infiniteScrollActionContext.isLoadAction,
                newUserNotifications: userNotifications
              });
            }),
            catchError((error) => infiniteScrollActionContext.throwError(error))
          );
      })
    );

  @Effect()
  markNotificationRead$ = this.actions$
    .pipe(
      ofType<fromUserNotificationListActions.MarkNotificationRead>(fromUserNotificationListActions.MARK_NOTIFICATION_READ),
      switchMap((action) => {
        if (action.payload.closePopover) {
          this.userNotificationEventHelperService.closePopoverEvent();
        }
        return this.notificationApiService.markNotificationAsRead(action.payload.userNotificationId).pipe(
          mergeMap(response => [
            new fromAppNotificationsActions.UpdateUserNotificationUnreadCount(),
            new fromUserNotificationListActions.MarkNotificationReadSuccess()
          ]),
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
          mergeMap(response => [
            new fromAppNotificationsActions.ClearUserNotificationUnseenCount(),
            new fromUserNotificationListActions.MarkAllNotificationsSeenSuccess()]),
          catchError(() => of(new fromUserNotificationListActions.MarkAllNotificationsSeenError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromUserNotificationReducer.State>,
    private notificationApiService: NotificationsApiService,
    private infiniteScrollEffectsService: InfiniteScrollEffectsService,
    private userNotificationEventHelperService: UserNotificationEventHelperService
  ) {}
}
