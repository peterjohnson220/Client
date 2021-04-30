import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';

import { PricingLegacyApiService, JobsApiService, PricingEdmxApiService } from 'libs/data/payfactors-api';
import { PricingInfo } from 'libs/models/payfactors-api';


import * as fromFeatureFlagRedirectReducer from '../../../../state/state';
import { UrlPage } from '../../../../models/url-redirect/url-page';
import { UrlRedirectHelper } from '../../../../core/helpers/url-redirect-helper';
import * as fromPricingDetailsReducer from '../reducers';
import * as fromPricingDetailsActions from '../actions';


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
    withLatestFrom(
      this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject}),
      (action: fromPricingDetailsActions.AddingToNewProject, redirectUrl: string) => ({action, redirectUrl})
    ),
    switchMap((data: any) => {
      return this.jobsApiService.createProject(data.action.payload).pipe(
        mergeMap((projectId: number) => {
          window.location.href = UrlRedirectHelper.getIdParamUrl(data.redirectUrl, projectId.toString());

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
        map(() => new fromPricingDetailsActions.SavingPricingSuccess()),
        catchError(error => of(new fromPricingDetailsActions.SavingPricingError(error)))
      );
    })
  );
}
