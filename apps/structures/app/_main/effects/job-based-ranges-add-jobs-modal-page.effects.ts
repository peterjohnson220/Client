import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WindowCommunicationService } from 'libs/core/services';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import { ProjectApiService } from 'libs/data/payfactors-api/project';
import * as fromPaymarketReducer from 'libs/features/add-jobs/reducers';
import { ADD_JOB_PAGE } from 'libs/features/add-jobs/constants/add-jobs-modal.constants';

import * as fromJobBasedRangesAddJobsModalPageActions from '../actions/job-based-ranges-add-jobs-modal-page.actions';
import * as fromJobRangeModelingModalActions from '../actions/job-range-modeling-modal.actions';
import * as fromStructuresReducer from '../reducers';
import { JobRangeModelingModalPage } from '../constants/structures.constants';

@Injectable()
export class JobBasedRangesAddJobsModalPageEffects {
  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalPageActions.SET_CONTEXT),
      mergeMap(() =>
        [new fromUserFilterActions.Init()]
      ));

  @Effect()
  addJobs$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalPageActions.ADD_SELECTED_JOBS),
      withLatestFrom(
        this.store.select(fromStructuresReducer.getContext),
        this.store.select(fromPaymarketReducer.getSelectedPaymarkets),
        this.store.select(fromStructuresReducer.getSelectedJobIds),
        this.store.select(fromStructuresReducer.getSelectedPayfactorsJobCodes),
        (action: fromJobBasedRangesAddJobsModalPageActions.AddSelectedJobs, context, payMarkets, selectedJobIds, selectedJobCodes) =>
          ({action, context, payMarkets, selectedJobIds, selectedJobCodes})
      ),
      switchMap((contextData) => {
          const companyJobIds = contextData.selectedJobIds.map(j => Number(j));
          return this.projectApiService.addJobs(contextData.context.ProjectId, {
            CompanyPayMarketIds: contextData.payMarkets,
            CompanyJobIds: companyJobIds,
            PayfactorsJobCodes: contextData.selectedJobCodes
          })
            .pipe(
              mergeMap(() => [
                  new fromJobBasedRangesAddJobsModalPageActions.AddSelectedJobsSuccess(),
                  new fromSearchPageActions.CloseSearchPage()
                ]
              ),
              catchError(error => of(new fromJobBasedRangesAddJobsModalPageActions.AddSelectedJobsError(error)))
            );
        }
      )
    );

  @Effect({dispatch: false})
  addProjectJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalPageActions.ADD_SELECTED_JOBS_SUCCESS),
      tap((action: fromJobBasedRangesAddJobsModalPageActions.AddSelectedJobsSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      }),
      map(() => new fromCompanySettingsActions.LoadCompanySettings())
    );

  @Effect()
  closeSurveySearch$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CLOSE_SEARCH_PAGE),
      mergeMap(() =>
        [new fromJobBasedRangesAddJobsModalPageActions.CloseAddJobsModalPage(ADD_JOB_PAGE.SEARCH)]
      )
    );

  @Effect()
  closeAddJobsModalPage$ = this.actions$
    .pipe(
      ofType(fromJobBasedRangesAddJobsModalPageActions.CLOSE_ADD_JOBS_MODAL_PAGE),
      withLatestFrom(
        this.store.select(fromStructuresReducer.getContext),
        (action: fromJobBasedRangesAddJobsModalPageActions.CloseAddJobsModalPage, context) => {
          return {
            action,
            context
          };
        }
      ),
      mergeMap(obj => {
        const actions = [];

        if (obj.context.IsFromAddStructureModal) {
          switch (obj.action.source as ADD_JOB_PAGE) {
            case ADD_JOB_PAGE.SEARCH:
            case ADD_JOB_PAGE.ADD_JOBS:
              actions.push(new fromJobRangeModelingModalActions.ChangePage(JobRangeModelingModalPage.ModelSettings));
              break;
            case ADD_JOB_PAGE.MODEL_SETTINGS:
            case ADD_JOB_PAGE.DEFAULT:
            default:
              actions.push(new fromJobRangeModelingModalActions.CloseModal());
              break;
          }
        } else {
          actions.push(new fromJobRangeModelingModalActions.CloseModal());
        }

        return actions;
      }));

  constructor(
    private actions$: Actions,
    private windowCommunicationService: WindowCommunicationService,
    private projectApiService: ProjectApiService,
    private store: Store<fromStructuresReducer.State>
  ) {
  }
}
