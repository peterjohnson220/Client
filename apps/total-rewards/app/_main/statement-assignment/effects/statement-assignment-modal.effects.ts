import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';

import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';

import * as fromStatementAssignmentModalActions from '../actions/statement-assignment-modal.actions';

@Injectable()
export class StatementAssignmentModalEffects {

  @Effect()
  setContext$ = this.actions$
    .pipe(
      ofType(fromStatementAssignmentModalActions.SET_CONTEXT),
      mergeMap(() =>
        [ new fromUserFilterActions.Init() ]
      )
    );

  constructor(private actions$: Actions) {}
}
