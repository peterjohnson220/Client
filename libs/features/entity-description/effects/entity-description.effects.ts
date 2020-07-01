import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromEntityDescriptionActions from '../actions/';

@Injectable()
export class EntityDescriptionEffects {
  @Effect()
  getEntityDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromEntityDescriptionActions.GET_ENTITY_DESCRIPTION),
    switchMap((action: fromEntityDescriptionActions.GetEntityDescription) => {
        return this.companyApiService.getEntityDescription(action.payload.entityType, action.payload.entityId).pipe(
          map((description: string) => {
              return new fromEntityDescriptionActions.GetEntityDescriptionSuccess(description);
            }
          ),
          catchError(error => of(new fromEntityDescriptionActions.GetEntityDescriptionError())));
      }
    )
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) { }
}
