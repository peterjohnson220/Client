import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';

import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';

import * as fromOrgDataFieldMappingsActions from '../actions/org-data-field-mappings.actions';

@Injectable()
export class OrgDataFieldMappingsEffects {

  @Effect()
  SaveFieldMappings$: Observable<Action> = this.actions$
    .ofType(fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS).pipe(
      map((action: fromOrgDataFieldMappingsActions.SavingFieldMappings) => action.payload),
      switchMap((mappings: any) => {
        return this.loaderFieldMappingsApiService.saveFieldMappings(mappings).pipe(
          map(() => new fromOrgDataFieldMappingsActions.SavingFieldMappingsSuccess()),
          catchError(error => of(new fromOrgDataFieldMappingsActions.SavingFieldMappingsError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) {}
}
