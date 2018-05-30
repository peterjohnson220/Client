import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { JobDescriptionManagementApiService } from 'libs/data/payfactors-api';
import * as fromJdmViewActions from '../actions/view.actions';

@Injectable()
export class JdmViewEffects {

  @Effect()
  loadViews$: Observable<Action> = this.actions$
    .ofType(fromJdmViewActions.LOADING_VIEWS)
    .switchMap(() =>
      this.jobdescriptionManagementApiService.getViews()
        .map((views: string[]) => new fromJdmViewActions.LoadingViewsSuccess({viewNames: views}))
        .catch(error => of(new fromJdmViewActions.LoadingViewsError(error)))
    );

  constructor(
    private actions$: Actions,
    private jobdescriptionManagementApiService: JobDescriptionManagementApiService
  ) {}
}
