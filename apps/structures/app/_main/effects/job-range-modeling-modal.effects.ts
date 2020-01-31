import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import {  mergeMap} from 'rxjs/operators';
import * as fromJobRangeModelingModalActions from '../actions/job-range-modeling-modal.actions';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class JobRangeModelingModalEffects {
  @Effect()
  openModal$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobRangeModelingModalActions.OPEN_MODAL),
      mergeMap((action: fromJobRangeModelingModalActions.OpenModal) =>
        [new fromJobRangeModelingModalActions.ChangePage(action.payload)]
      ));

  @Effect()
  changePage$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromJobRangeModelingModalActions.CHANGE_PAGE),
      mergeMap((action: fromJobRangeModelingModalActions.ChangePage) =>
        [new fromJobRangeModelingModalActions.UpdateTitle(action.payload)]
      ));

  constructor(
    private actions$: Actions
  ) {
  }
}
