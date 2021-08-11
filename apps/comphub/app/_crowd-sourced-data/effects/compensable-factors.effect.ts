import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';

import * as fromComphubCrowdSourcedDataReducer from '../reducers';
import * as fromComphubSharedReducer from '../../_shared/reducers';
import * as fromSharedComphubPageActions from '../../_shared/actions/comphub-page.actions';
import * as fromSharedMarketPageActions from '../../_shared/actions/markets-card.actions';
import * as fromCompensableFactorsActions from '../actions/compensable-factors.actions';
import { CompensableFactorDataMapper } from '../helpers';

@Injectable()
export class CompensableFactorsEffect {

  @Effect()
  getCompensableFactors = this.actions$
    .pipe(
      ofType(
        fromCompensableFactorsActions.GET_ALL_COMPENSABLE_FACTORS,
        fromSharedComphubPageActions.SET_SELECTED_JOB_DATA,
        fromSharedMarketPageActions.SET_SELECTED_PAYMARKET
        ),
      withLatestFrom(
        this.sharedStore.select(fromComphubSharedReducer.getSelectedJobData),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedPaymarket),
        this.sharedStore.select(fromComphubSharedReducer.getWorkflowContext),
        (action: fromCompensableFactorsActions.GetAllCompensableFactors, selectedJob, selectedPaymarket, workflowContext) =>
          ({ action, selectedJob, selectedPaymarket, workflowContext })
      ),
      switchMap((data) => {
          return this.comphubCSDApiService.getCompensableFactors({
            JobTitle: data.selectedJob.JobTitle,
            Country: data.workflowContext.activeCountryDataSet.CountryName,
            PaymarketId: data?.selectedPaymarket.CompanyPayMarketId
          })
            .pipe(
              mergeMap((response) => {
                const actions = [];
                actions.push(new fromCompensableFactorsActions.GetAllCompensableFactorsSuccess(
                  CompensableFactorDataMapper.getCompensableFactorDataMap(response)));

                return actions;
              }),
              catchError((error) => of(new fromCompensableFactorsActions.GetAllCompensableFactorsError()))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubCrowdSourcedDataReducer.State>,
    private sharedStore: Store<fromComphubSharedReducer.State>,
    private comphubCSDApiService: ComphubCrowdSourcedApiService,
  ) {}
}
