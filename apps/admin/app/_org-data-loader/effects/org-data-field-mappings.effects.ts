import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';

import { LoaderFieldMappingsApiService } from 'libs/data/payfactors-api/data-loads';
import { LoaderFieldSet } from 'libs/models/data-loads';

import * as fromOrgDataFieldMappingsActions from '../actions/org-data-field-mappings.actions';

@Injectable()
export class OrgDataFieldMappingsEffects {
  @Effect()
  loadFieldMappings$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromOrgDataFieldMappingsActions.LOADING_FIELD_MAPPINGS),
      switchMap((action: fromOrgDataFieldMappingsActions.LoadingFieldMappings) =>
        this.loaderFieldMappingsApiService.getCompanyFieldMappings(action.companyId, action.configGroupId).pipe(
          map((fieldMappings: LoaderFieldSet[]) => {
            return new fromOrgDataFieldMappingsActions.LoadingFieldMappingsSuccess(fieldMappings);
          }),
          catchError(error => of(new fromOrgDataFieldMappingsActions.LoadingFieldMappingsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private loaderFieldMappingsApiService: LoaderFieldMappingsApiService
  ) {}
}
