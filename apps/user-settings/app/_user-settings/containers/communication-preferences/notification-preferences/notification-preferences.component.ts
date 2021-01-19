import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import groupBy from 'lodash/groupBy';

import { AsyncStateObj } from 'libs/models/state';

import { NotificationPreference } from '../../../models/communication-preferences';
import * as fromUserSettingsReducer from '../../../reducers';
import * as fromNotificationPreferenceActions from '../../../actions/notification-preferences.actions';

@Component({
  selector: 'pf-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['../communication-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit, OnDestroy {

  NotificationPreferences$: Observable<AsyncStateObj<NotificationPreference[]>>;
  NotificationPreferencesSubscription: Subscription;
  UpdatingNotificationPreferences$: Observable<boolean>;
  changes$: Observable<boolean>;
  saveNotificationPreferencesResponse$: Observable<string>;
  NotificationPreferencesGrouped: any;

  constructor(public store: Store<fromUserSettingsReducer.State>) {
    this.NotificationPreferences$ = this.store.select(fromUserSettingsReducer.getNotificationPreferences);
    this.UpdatingNotificationPreferences$ = this.store.select(fromUserSettingsReducer.getUpdatingNotificationPreferences);
    this.changes$ = this.store.select(fromUserSettingsReducer.getNotificationPreferencesHasPendingChanges);
    this.saveNotificationPreferencesResponse$ = this.store.select(fromUserSettingsReducer.getUpdateNotificationPreferencesApiResponse);
  }

  ngOnInit(): void {
    this.NotificationPreferencesSubscription = this.NotificationPreferences$.subscribe(x => {
      this.NotificationPreferencesGrouped = this.getPreferencesGrouped(x.obj);
    });
  }

  handleSaveClicked() {
    let preferences: NotificationPreference[];
    this.NotificationPreferences$.pipe(take(1)).subscribe(x => {
      preferences = x.obj;
    });
    if (preferences) {
      this.store.dispatch(new fromNotificationPreferenceActions.UpdateNotificationPreferences(preferences));
    }
  }

  handlePreferenceChanged(preference: NotificationPreference, isEmail: boolean) {
    this.store.dispatch(new fromNotificationPreferenceActions.ToggleNotificationPreference({preference: preference, isEmail: isEmail}));
  }

  ngOnDestroy(): void {
    this.NotificationPreferencesSubscription.unsubscribe();
  }

  getPreferencesGrouped(preferences: NotificationPreference[]): any[] {
    return Object.entries(groupBy(preferences, pref => pref.GroupName));
  }
}
