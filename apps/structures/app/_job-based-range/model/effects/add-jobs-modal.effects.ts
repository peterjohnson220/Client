import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WindowCommunicationService } from 'libs/core/services';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromAddJobsPageActions from 'libs/features/add-jobs/actions/add-jobs-page.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromAddJobsReducer from 'libs/features/add-jobs/reducers';
import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';

import * as fromSharedReducer from '../../shared/reducers';
import * as fromSharedActions from '../../shared/actions/shared.actions';
import * as fromSharedModelSettingsActions from '../../shared/actions/model-settings-modal.actions';

@Injectable()
export class AddJobsModalEffects {
  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.SET_CONTEXT_STRUCTURES_RANGE_GROUP_ID),
      mergeMap(() =>
        [new fromUserFilterActions.Init()]
      ));

  @Effect()
  addJobs$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS),
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        this.store.select(fromAddJobsReducer.getSelectedPaymarkets),
        this.store.select(fromAddJobsReducer.getSelectedJobIds),
        this.store.select(fromAddJobsReducer.getSelectedPayfactorsJobCodes),
        this.store.select(fromSharedReducer.getMetadata),
        this.store.select(fromSharedReducer.getIsNewModelAddJobs),
        (action: fromAddJobsPageActions.AddSelectedJobs, contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, isNewModelAddJobs) =>
          ({action, contextStructureRangeGroupId, payMarkets, selectedJobIds, selectedJobCodes, metadata, isNewModelAddJobs})
      ),
      switchMap((contextData) => {
          const companyJobIds = contextData.selectedJobIds.map(j => Number(j));
          return this.structureRangeGroupApiService.addJobsToRangeGroup(contextData.contextStructureRangeGroupId, { JobIds: companyJobIds, PaymarketId: contextData.metadata.PaymarketId })
            .pipe(
              mergeMap(() => contextData.isNewModelAddJobs ? [
                  new fromAddJobsPageActions.AddSelectedJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage(),
                  new fromSharedActions.SetIsNewModelModelSettings(true),
                  new fromSharedModelSettingsActions.OpenModal(),
                ] : [
                  new fromAddJobsPageActions.AddSelectedJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage()
                ]
              ),
              catchError(error => of(new fromAddJobsPageActions.AddSelectedJobsError(error)))
            );
        }
      )
    );

  @Effect({dispatch: false})
  addJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromAddJobsPageActions.ADD_SELECTED_JOBS_SUCCESS),
      tap((action: fromAddJobsPageActions.AddSelectedJobsSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      }),
      map(() => new fromCompanySettingsActions.LoadCompanySettings())
    );

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
