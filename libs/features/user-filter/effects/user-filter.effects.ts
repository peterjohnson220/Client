import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { UserFilterApiService } from 'libs/data/payfactors-api';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromUserFilterActions from '../actions/user-filter.actions';
import * as fromUserFilterReducer from '../reducers';

@Injectable()
export class UserFilterEffects {

  @Effect()
  getAll$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.GET_ALL),
    withLatestFrom(
      this.store.select(fromSearchReducer.getSearchFilterMappingData),
      this.store.select(fromSearchReducer.getUserFilterTypeData),
      (action: fromUserFilterActions.GetAll, searchFilterMappingDataObj, userFilterTypeData ) =>
        ({ action, searchFilterMappingDataObj, userFilterTypeData })
    ),
    switchMap((data) => {
      return this.userFilterApiService.getAll({ Type: data.userFilterTypeData.Type })
        .pipe(
          mergeMap(response => [
            new fromUserFilterActions.GetSuccess(
              this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(response, data.searchFilterMappingDataObj))
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
    withLatestFrom(
      this.store.select(fromSearchReducer.getUserFilterTypeData),
      (action: fromUserFilterActions.Delete, userFilterTypeData) => ({ action, userFilterTypeData })),
    switchMap((data) => {
      const request = {
        Type: data.userFilterTypeData.Type,
        SavedFilter: {
          Id: data.action.payload.savedFilterId,
        }
      };
      return this.userFilterApiService.remove(request)
      .pipe(
        map(() => {
          return new fromUserFilterActions.DeleteSuccess({ deletedFilterId: data.action.payload.savedFilterId });
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private userFilterApiService: UserFilterApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private store: Store<fromUserFilterReducer.State>
  ) { }
}
