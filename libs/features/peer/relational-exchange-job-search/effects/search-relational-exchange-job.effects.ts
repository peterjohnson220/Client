import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap} from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromUserFilterActions from 'libs/features/users/user-filter/actions/user-filter.actions';

import * as fromExchangeJobSearchReducer from '../reducers';
import * as fromExchangeJobSearchActions from '../actions/relational-exchange-job-search.actions';

@Injectable()
export class SearchRelationalExchangeJobEffects {

  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromExchangeJobSearchActions.SET_CONTEXT),
      mergeMap(() =>
        [ new fromUserFilterActions.Init() ]
      )
    );

  constructor(
    private store: Store<fromExchangeJobSearchReducer.State>,
    private actions$: Actions
  ) {}
}
