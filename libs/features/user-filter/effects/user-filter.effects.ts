import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { UserFilterApiService } from 'libs/data/payfactors-api';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';

import * as fromUserFilterActions from '../actions/user-filter.actions';
import { UserFilterTypeData } from '../models';

@Injectable()
export class UserFilterEffects {

  @Effect()
  getAll$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.GET_ALL),
    switchMap((action: fromUserFilterActions.GetAll) => {
      return this.userFilterApiService.getAll({ Type: this.userFilterTypeData.Type })
        .pipe(
          mergeMap(response => [
            new fromUserFilterActions.GetSuccess(
              this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(response))
          ])
        );
    })
  );

  @Effect()
  upsert$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.UPSERT),
    switchMap((action: fromUserFilterActions.Upsert) => {
      const request = action.payload;
      const isEditMode = !!request.SavedFilter.Id;
      return this.userFilterApiService.upsert(request)
        .pipe(
          map((response) => {
            return new fromUserFilterActions.UpsertSuccess({isNew: !isEditMode, savedFilterId: response});
          }),
          catchError(response => {
            return of(response.status === 409
              ? new fromUserFilterActions.UpsertConflict()
              : new fromUserFilterActions.UpsertError());
          })
        );
    })
  );

  @Effect()
  delete$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.DELETE),
    switchMap((action: fromUserFilterActions.Delete) => {
      const request = {
        Type: this.userFilterTypeData.Type,
        SavedFilter: {
          Id: action.payload.savedFilterId,
        }
      };
      return this.userFilterApiService.remove(request)
      .pipe(
        map(() => {
          return new fromUserFilterActions.DeleteSuccess({ deletedFilterId: action.payload.savedFilterId });
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private userFilterApiService: UserFilterApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private userFilterTypeData: UserFilterTypeData
  ) { }
}
