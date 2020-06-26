import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';

import { UrlService } from '../../shared/services';
import { Workflow } from '../../shared/constants/workflow';

@Injectable()
export class SearchPageEffects {

  @Effect({ dispatch: false})
  cancel$ = this.actions$
    .pipe(
      ofType(fromSearchPageActions.CANCEL),
      tap(() => this.urlService.removeWorkflow(Workflow.NewJobBasedRange))
    );

  constructor(
    private actions$: Actions,
    private urlService: UrlService
  ) {}
}
