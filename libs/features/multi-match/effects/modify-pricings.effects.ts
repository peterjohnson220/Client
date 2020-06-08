import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { JobsApiService } from 'libs/data/payfactors-api/index';
import { staticFilters } from '../../survey-search/data';
import { PayfactorsApiModelMapper } from '../helpers';

import * as fromModifyPricingsActions from '../actions/modify-pricings.actions';
import * as fromContextActions from '../../survey-search/actions/context.actions';
import * as fromSearchFiltersActions from '../../search/actions/search-filters.actions';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';

@Injectable()
export class ModifyPricingsEffects {
  constructor(
    private action$: Actions,
    private jobsApiService: JobsApiService
  ) {}

  @Effect()
  modifyPricings$: Observable<Action> = this.action$.pipe(
    ofType(fromModifyPricingsActions.GET_PRICINGS_TO_MODIFY),
    switchMap((action: any) => {
      return this.jobsApiService.getPricingsToModify(action.payload).pipe(
        mergeMap(response => {
          const actions = [];
          actions.push(new fromContextActions.SetModifyPricingsSearchContext(response.Context));
          actions.push(new fromSearchFiltersActions.AddFilters(staticFilters));
          actions.push(new fromJobsToPriceActions.GetJobsToPriceSuccess(
            PayfactorsApiModelMapper.mapMatchedSurveyJobToJobsToPrice(response.PricingsToModify)));
          actions.push(new fromModifyPricingsActions.GetPricingsToModifySuccess());
          return actions;
        }),
        catchError(error => of(new fromModifyPricingsActions.GetPricingsToModifyError()))
      );
    })
  );
}
