import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as fromJobDescriptionHistoryListActions from '../actions/job-description-history-list.actions';
import * as fromJobDescriptionHistoryListReducer from '../reducers';
import { JobDescriptionApiService } from 'libs/data/payfactors-api/jdm';
import { JobDescriptionHistoryListItemResponse } from 'libs/models/payfactors-api/job-description-management/response';
import { PayfactorsApiModelMapper } from 'libs/features/jobs/job-description-management/helpers';

@Injectable()
export class JobDescriptionHistoryListEffects {
  @Effect()
  loadJobDescriptionHistoryListItems$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobDescriptionHistoryListActions.LOAD_JOB_DESCRIPTION_HISTORY_LIST_ITEMS),
      switchMap((action: fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItems) =>
        this.jobDescriptionApiService.getHistoryList(action.payload.JobDescriptionId).pipe(
          map((response: JobDescriptionHistoryListItemResponse[]) => {
            const historyListItemList = PayfactorsApiModelMapper.mapJDHistoryListItemResponseListToJDHistoryListItemList(response);
            return new fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItemsSuccess(historyListItemList);
          }),
          catchError(response => of(new fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItemsError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private store: Store<fromJobDescriptionHistoryListReducer.State>,
  ) {}
}
