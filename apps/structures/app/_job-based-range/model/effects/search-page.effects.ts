import { Injectable } from '@angular/core';

import { filter, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSearchReducer from 'libs/features/search/reducers';
import { SearchFeatureIds } from 'libs/features/search/enums/search-feature-ids';

import { UrlService } from '../../shared/services';
import { Workflow } from '../../../shared/constants/workflow';

@Injectable()
export class SearchPageEffects {

  @Effect({ dispatch: false})
  cancel$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CANCEL),
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchFeatureId),
        (action: fromSearchPageActions.Cancel, searchFeatureId) =>
          ({ action, searchFeatureId })
      ),
      filter((data) => data.searchFeatureId === SearchFeatureIds.AddJobs),
      tap(() => this.urlService.removeWorkflow(Workflow.NewJobBasedRange))
    );

  constructor(
    private actions$: Actions,
    private urlService: UrlService,
    private store: Store<any>
  ) {}
}
