import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';
import * as fromJdmViewActions from '../actions/view.actions';

@Injectable()
export class JdmViewEffects {

  @Effect()
  loadViews$: Observable<Action> = this.actions$
    .ofType(fromJdmViewActions.LOADING_VIEWS).pipe(
      switchMap(() =>
        this.jobdescriptionManagementApiService.getViews().pipe(
          map((views: string[]) => new fromJdmViewActions.LoadingViewsSuccess({viewNames: views})),
          catchError(error => of(new fromJdmViewActions.LoadingViewsError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private jobdescriptionManagementApiService: JobDescriptionManagementApiService
  ) {}
}
