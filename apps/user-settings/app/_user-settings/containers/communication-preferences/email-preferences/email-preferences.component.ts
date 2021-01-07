import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromEmailPreferenceActions from '../../../actions/email-preferences.actions';
import { UserSubscription } from '../../../models/communication-preferences';

@Component({
  selector: 'pf-email-preferences',
  templateUrl: './email-preferences.component.html',
  styleUrls: ['../communication-preferences.component.scss']
})
export class EmailPreferencesComponent implements OnInit, OnDestroy {
  UserSubscriptions$: Observable<AsyncStateObj<UserSubscription[]>>;
  UserSubscriptions: UserSubscription[];
  UserSubscriptionsSubscription: Subscription;
  changes$: Observable<boolean>;
  saveEmailPreferencesResponse$: Observable<string>;

  constructor(public store: Store<fromUserSettingsReducer.State>) {
    this.UserSubscriptions$ = this.store.select(fromUserSettingsReducer.getUserSubscriptions);
    this.changes$ = this.store.select(fromUserSettingsReducer.getUserSubscriptionsHasPendingChanges);
    this.saveEmailPreferencesResponse$ = this.store.select(fromUserSettingsReducer.getUpdateEmailPreferencesApiResponse);
  }

  ngOnInit(): void {
    this.UserSubscriptionsSubscription = this.UserSubscriptions$.subscribe(x => {
      this.UserSubscriptions = x.obj;
    });
  }

  ngOnDestroy(): void {
    this.UserSubscriptionsSubscription.unsubscribe();
  }

  handleSaveClicked() {
    this.store.dispatch(new fromEmailPreferenceActions.UpdateUserSubscriptions( this.UserSubscriptions));
  }

  handleSubscriptionChange(event: any, s: UserSubscription) {
    this.store.dispatch(new fromEmailPreferenceActions.ToggleUserSubscription({
      UserSubscriptionId: s.UserSubscriptionId,
      Checked: event.target.checked
    }));
  }
}
