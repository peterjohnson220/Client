import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';
import { ExchangeJobSearchApiService} from 'libs/data/payfactors-api/search/peer/exchange-job-search-api.service';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { ComphubPages } from '../data';
import * as fromComphubMainReducer from '../reducers';

@Injectable()
export class JobsCardEffects {

  @Effect()
  getTrendingJobs$ = this.actions$
    .pipe(
      ofType(fromJobsCardActions.GET_TRENDING_JOBS),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromJobsCardActions.GetTrendingJobs, activeCountryDataSet) => ({ activeCountryDataSet })
      ),
      filter((data) => !!data.activeCountryDataSet),
      switchMap((data) => {
          return this.comphubApiService.getTrendingJobs(data.activeCountryDataSet.CountryCode)
            .pipe(
              map(response => {
                const trendingJobGroups = PayfactorsApiModelMapper.mapTrendingJobGroupsResponseToTrendingJobGroups(response);
                return new fromJobsCardActions.GetTrendingJobsSuccess(trendingJobGroups);
              }),
              catchError((error) => of(new fromJobsCardActions.GetTrendingJobsError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  @Effect()
  getJobSearchOptions$ = this.actions$
    .pipe(
      ofType(fromJobsCardActions.GET_JOB_SEARCH_OPTIONS),
      debounceTime(100),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromJobsCardActions.GetJobSearchOptions, dataSet) => ({ action, dataSet })
      ),
      switchMap((data) => {
          return this.jobSearchApiService.getJobSearchAutocompleteResults({
            Prefix: data.action.payload,
            PayfactorsCountryCode: data.dataSet.CountryCode
          }).pipe(
              map(response => {
                return new fromJobsCardActions.GetJobSearchOptionsSuccess(response);
              }),
              catchError((error) => of(new fromJobsCardActions.GetJobSearchOptionsError(),
                new fromComphubPageActions.HandleApiError(error)))
            );
        }
      ));

  @Effect()
  getExchangeJobSearchOptions = this.actions$
    .pipe(
      ofType(fromJobsCardActions.GET_EXCHANGE_JOB_SEARCH_OPTIONS),
      debounceTime(100),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveExchangeDataSet),
        (action: fromJobsCardActions.GetExchangeJobSearchOptions, dataSet) => ({ action, dataSet })
      ),
      switchMap((data) => {
        return this.exchangeJobSearchApiService.getJobSearchAutocompleteResults({
          Prefix: data.action.payload,
          ExchangeId: data.dataSet.ExchangeId
        }).pipe(
          map((response: ExchangeJobSearchOption[]) => {
            return new fromJobsCardActions.GetExchangeJobSearchOptionsSuccess(response);
          }),
          catchError((error) => of(new fromJobsCardActions.GetExchangeJobSearchOptionsError(),
            new fromComphubPageActions.HandleApiError(error)))
        );
      })
    );
  @Effect()
  setSelectedJob$ = this.actions$
    .pipe(
      ofType(fromJobsCardActions.SET_SELECTED_JOB),
      map((action: fromJobsCardActions.SetSelectedJob) => action.payload),
      mergeMap((payload) => {
        const actions = [];

        actions.push(new fromComphubPageActions.ResetAccessiblePages());
        actions.push(new fromDataCardActions.ClearSelectedJobData());
        actions.push( new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Jobs, subTitle: payload.jobTitle}));
        actions.push(new fromComphubPageActions.AddAccessiblePages([ComphubPages.Markets, ComphubPages.Data]));

        if (payload.navigateToNextCard) {
          actions.push(new fromComphubPageActions.NavigateToNextCard());
        }

        return actions;
      })
    );

  @Effect()
  clearSelectedJob$ = this.actions$
    .pipe(
      ofType(fromJobsCardActions.CLEAR_SELECTED_JOB),
      mergeMap(() => [
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromDataCardActions.ClearSelectedJobData()
      ])
    );

  @Effect({dispatch: false})
  persistActiveCountryDataSet$ = this.actions$
    .pipe(
      ofType(fromJobsCardActions.PERSIST_ACTIVE_COUNTRY_DATA_SET),
      withLatestFrom(
        this.store.select(fromComphubMainReducer.getActiveCountryDataSet),
        (action: fromJobsCardActions.PersistActiveCountryDataSet, dataSet) => (dataSet)
      ),
      switchMap((dataSet) => this.comphubApiService.persistActiveCountryDataSet(dataSet.CountryCode))
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubReducer.State>,
    private comphubApiService: ComphubApiService,
    private jobSearchApiService: JobSearchApiService,
    private exchangeJobSearchApiService: ExchangeJobSearchApiService
  ) {
  }
}
