import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromAddJobsModalActions from '../actions/modal.actions';
import * as fromAddJobsReducer from '../reducers';

@Injectable()
export class AddJobsModalEffects {
  @Effect()
  openAddJobsModal$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromAddJobsModalActions.HANDLE_PAGE_COMPLETE),
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getHasNextPage),
        (action: fromAddJobsModalActions.HandlePageComplete, hasNextPage: boolean) => ({action, hasNextPage})
      ),
      switchMap((obj) =>
        obj.hasNextPage
          ? [new fromAddJobsModalActions.ChangePage()]
          : [new fromAddJobsModalActions.CloseAddJobsModal()]
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromAddJobsReducer.State>
  ) {
  }
}
