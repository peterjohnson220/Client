import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as fromJobRangeModelingModalActions from '../actions/job-range-modeling-modal.actions';
import * as fromStructuresMainReducer from '../reducers';

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
      withLatestFrom(
        this.store.select(fromStructuresMainReducer.getCurrentModel),
        (action: fromJobRangeModelingModalActions.ChangePage, currentModel) => ({action, currentModel})
      ),
      switchMap((obj) => {
        const title = `${obj.currentModel && obj.currentModel.RangeGroupName
          ? obj.currentModel.RangeGroupName + ' - '
          : ''} ${obj.action.payload} `;
        return [new fromJobRangeModelingModalActions.UpdateTitle(title)];
      }));

  constructor(
    private actions$: Actions,
    private store: Store<fromStructuresMainReducer.State>
  ) {
  }
}
