import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/search/actions/search-results.actions';

@Injectable()
export class EmployeeSearchUserFilterEffects {

  @Effect()
  initEmployeeSearchUserFilter$ = this.actions$
    .pipe(
      ofType(fromUserFilterActions.INIT),
      mergeMap(() =>
        [ new fromSearchResultsActions.GetResults({keepFilteredOutOptions: false}) ]
      )
    );

  constructor(private actions$: Actions) {}
}
