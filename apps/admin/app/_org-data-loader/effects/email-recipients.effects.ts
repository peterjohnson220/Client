import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, switchMap, map } from 'rxjs/internal/operators';

import { DataLoadEmailRecipientsApiService } from 'libs/data/payfactors-api/data-loads/data-load-email-recipients-api.service';

import * as fromOrgDataEmailRecipientsActions from '../actions/email-recipients.actions';

@Injectable()
export class OrgDataEmailRecipientsEffects {

  @Effect()
  loadingEmailRecipients$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataEmailRecipientsActions.LOAD_EMAIL_RECIPIENTS),
      switchMap((action: fromOrgDataEmailRecipientsActions.LoadEmailRecipients) =>
        this.orgDataEmailRecipientService.getRecipients(action.payload).pipe(
          map((recipients: any) => {
            return new fromOrgDataEmailRecipientsActions.LoadEmailRecipientsSuccess(recipients);
          }),
          catchError(error => of(new fromOrgDataEmailRecipientsActions.LoadEmailRecipientsError()))
        )
      )
    );

  @Effect()
  savingEmailRecipients$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataEmailRecipientsActions.SAVING_EMAIL_RECIPIENT),
      switchMap((action: fromOrgDataEmailRecipientsActions.SavingEmailRecipient) =>
      this.orgDataEmailRecipientService.insertRecipient(action.payload).pipe(
        map((recipient: any) => {
          return new fromOrgDataEmailRecipientsActions.SavingEmailRecipientSuccess(recipient);
        }),
        catchError(error => of(new fromOrgDataEmailRecipientsActions.SavingEmailRecipientError()))
        )
      )
    );

  @Effect()
  removingEmailRecipient$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataEmailRecipientsActions.REMOVING_EMAIL_RECIPIENT),
      switchMap((action: fromOrgDataEmailRecipientsActions.RemovingEmailRecipient) =>
      this.orgDataEmailRecipientService.deleteRecipient(action.payload).pipe(
        map((recipient: any) => {
          return new fromOrgDataEmailRecipientsActions.RemovingEmailRecipientSuccess(recipient);
        }),
        catchError(error => of(new fromOrgDataEmailRecipientsActions.RemovingEmailRecipientError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private orgDataEmailRecipientService: DataLoadEmailRecipientsApiService
  ) {}
}
