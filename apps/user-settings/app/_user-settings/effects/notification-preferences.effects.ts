import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import orderBy from 'lodash/orderBy';

import { NotificationsApiService } from 'libs/data/payfactors-api/notifications';
import { NotificationPreferenceDto } from 'libs/models/notifications/notification-preference-dto.model';

import { NotificationPreference } from '../models/communication-preferences';
import { NotificationPreferenceDtoToPreferenceMapper } from '../helpers/notificationpreferencedto-to-preference.mapper';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromNotificationPreferencesReducer from '../reducers';
import * as fromNotificationPreferencesActions from '../actions/notification-preferences.actions';

@Injectable()
export class NotificationPreferencesEffects {
  @Effect()
  getNotificationPreferences$ = this.actions$
    .pipe(
      ofType(fromNotificationPreferencesActions.GET_NOTIFICATION_PREFERENCES),
      switchMap(() => {
        return this.notificationsApiService.getUserNotificationPreferences()
          .pipe(
            map((notificationPreferences: NotificationPreferenceDto[]) =>
              new fromNotificationPreferencesActions.GetNotificationPreferencesSuccess(this.mapToPreferences(notificationPreferences))),
            catchError(() => of(new fromNotificationPreferencesActions.GetNotificationPreferencesError()))
          );
      })
    );

  @Effect()
  updateNotificationPreferences$ = this.actions$
    .pipe(
      ofType(fromNotificationPreferencesActions.UPDATE_NOTIFICATION_PREFERENCES),
      switchMap( (action: fromNotificationPreferencesActions.UpdateNotificationPreferences) => {
        const request = PayfactorsApiModelMapper.buildNotificationPreferencesRequest(action.payload);
        return this.notificationsApiService.updateNotificationPreferences(request)
          .pipe(
            map(() => new fromNotificationPreferencesActions.UpdateNotificationPreferencesSuccess()),
            catchError(() => of(new fromNotificationPreferencesActions.UpdateNotificationPreferencesError()))
          );
      })
    );

  private mapToPreferences(notificationPreferenceDtos: NotificationPreferenceDto[]): NotificationPreference[] {
    return orderBy(notificationPreferenceDtos
      .map(np => NotificationPreferenceDtoToPreferenceMapper.mapPreferenceDtoToPreference(np)));
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromNotificationPreferencesReducer.State>,
    private notificationsApiService: NotificationsApiService
  ) {}
}
