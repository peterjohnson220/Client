import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as fromAddJobsModalActions from 'libs/features/add-jobs/actions/modal.actions';

@Injectable()
export class JobBasedRangeModalEffects {

  @Effect()
  openAddJobsModal$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromAddJobsModalActions.OPEN_ADD_JOBS_MODAL),
      switchMap(() => {
        return [new fromAddJobsModalActions.ChangePage()];
      }));

  constructor(
    private actions$: Actions
  ) {
  }
}
