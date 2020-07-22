import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromPricingDetailsReducer from '../reducers';
import * as fromPricingDetailsActions from '../actions';

import { PricingLegacyApiService, JobsApiService, PricingEdmxApiService } from 'libs/data/payfactors-api';
import { PricingInfo } from 'libs/models/payfactors-api';

@Injectable()
export class PricingDetailsEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromPricingDetailsReducer.State>,
    private pricingLegacyApiService: PricingLegacyApiService,
    private pricingEdmxApiService: PricingEdmxApiService,
    private jobsApiService: JobsApiService
  ) { }

  @Effect()
  loadPricingInfo$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingDetailsActions.GET_PRICING_INFO),
      switchMap(
        (action: fromPricingDetailsActions.GetPricingInfo) =>
          this.pricingLegacyApiService.getPricingInfo(action.payload).pipe(
            map((pricingInfo: PricingInfo) => {
              pricingInfo.Notes.sort((a, b) => b.CompanyJobPricingNoteId - a.CompanyJobPricingNoteId);
              return new fromPricingDetailsActions.GetPricingInfoSuccess(pricingInfo);
            }),
            catchError(response => of(new fromPricingDetailsActions.GetPricingInfoError()))
          )
      )
    );

  @Effect()
  addingToNewProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromPricingDetailsActions.ADDING_TO_NEW_PROJECT),
    switchMap((data: any) => {
      return this.jobsApiService.createProject(data.payload).pipe(
        mergeMap((projectId: number) => {
          window.location.href = `/marketdata/marketdata.asp?usersession_id=${projectId}`;
          // TODO: When we migrate the Projects page to Client we have to make sure the state is cleared if we return back to the Jobs page
          return [];
        }),
        catchError(error => of(new fromPricingDetailsActions.AddingToNewProjectError(error)))
      );
    })
  );

  @Effect()
  savingPricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromPricingDetailsActions.SAVING_PRICING),
    mergeMap((savingpricingAction: fromPricingDetailsActions.SavingPricing) =>
        of(savingpricingAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPricingDetailsReducer.getNewStatus)),
            (action: fromPricingDetailsActions.SavingPricing, newStatus) =>
              ({ action, newStatus})
          )
        ),
      ),
    switchMap((data) => {
      return this.pricingEdmxApiService.patchPricingStatus(data.action.pricingId, data.newStatus).pipe(
        map(() => {
          return new fromPricingDetailsActions.SavingPricingSuccess();
        }),
        catchError(error => of(new fromPricingDetailsActions.SavingPricingError(error)))
      );
    })
  );
}
