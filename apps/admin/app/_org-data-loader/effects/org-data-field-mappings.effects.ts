import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';

import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads/index';

import * as fromOrgDataFieldMappingsActions from '../actions/org-data-field-mappings.actions';
import {LoaderFieldSet} from '../models';

@Injectable()
export class OrgDataFieldMappingsEffects {
  @Effect()
  loadFieldMappings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataFieldMappingsActions.LOADING_FIELD_MAPPINGS),
      switchMap((action: fromOrgDataFieldMappingsActions.LoadingFieldMappings) =>
        this.loaderFieldMappingsApiService.getCompanyFieldMappings(action.payload).pipe(
          map((fieldMappings: LoaderFieldSet[]) => {
            return new fromOrgDataFieldMappingsActions.LoadingFieldMappingsSuccess(fieldMappings);
          }),
          catchError(error => of(new fromOrgDataFieldMappingsActions.LoadingFieldMappingsError()))
        )
      )
    );

  @Effect()
  SaveFieldMappings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataFieldMappingsActions.SAVING_FIELD_MAPPINGS),
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
