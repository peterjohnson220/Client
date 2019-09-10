import {Injectable} from '@angular/core';

import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs/index';
import {Action} from '@ngrx/store';
import { map, switchMap} from 'rxjs/operators';

import {JobDescriptionManagementApiService} from 'libs/data/payfactors-api/jdm/job-description-management-api.service';

import * as fromControlTypeActions from '../actions/control-types.actions';

@Injectable()
export class ControlTypesEffects {
  @Effect()
  loadControlTypes$: Observable<Action> = this.actions$.pipe(
    ofType(fromControlTypeActions.LOAD_CONTROL_TYPES),
    switchMap(() => {
      return this.jobDescriptionManagementApiService.getAvailableControls().pipe(
        map((response: any) => new fromControlTypeActions.LoadControlTypesSuccess(response))
    );
    })
);

  constructor(
    private actions$: Actions,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService
  ) {}
}
