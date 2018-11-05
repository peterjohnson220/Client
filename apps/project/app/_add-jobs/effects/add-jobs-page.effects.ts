import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { WindowCommunicationService } from 'libs/core/services';

import * as fromAddJobsPageActions from '../actions/add-jobs.page.actions';
import * as fromAddDataReducer from '../reducers';


@Injectable()
export class AddJobsPageEffects {

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .ofType(fromAddJobsPageActions.CLOSE_JOBS_SEARCH)
    .pipe(
      tap((action: fromAddJobsPageActions.CloseJobsSearch) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

    constructor(
      private actions$: Actions,
      private store: Store<fromAddDataReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
