import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, withLatestFrom, switchMap, map, catchError } from 'rxjs/operators';

import * as fromSearchReducer from 'libs/features/search/reducers';
import { FiltersHelper } from 'libs/features/search/helpers';
import { UserFilterApiService } from 'libs/data/payfactors-api';

import * as fromSaveFilterModalActions from '../actions/save-filter-modal.actions';
import * as fromUserFilterActions from '../actions/user-filter.actions';
import * as fromUserFilterReducer from '../reducers';
import { UserFilterTypeData } from '../models';

@Injectable()
export class SaveFilterModalEffects {
  @Effect()
  createSavedFilter$ = this.actions$
  .pipe(
    ofType(fromSaveFilterModalActions.CREATE_SAVED_FILTER),
    withLatestFrom(
      this.store.select(fromSearchReducer.getParentFilters),
      (action: fromSaveFilterModalActions.CreateSavedFilter, filters) => ({ action, filters })),
    mergeMap(data => {
      const actions = [];
      const selectedFilters = FiltersHelper.getMultiSelectFiltersWithSelections(data.filters);
      actions.push(new fromSaveFilterModalActions.SetModalData({
        Name: '',
        SetAsDefault: false,
        SearchFiltersToSave: selectedFilters.filter(f => !f.Locked && !f.SaveDisabled)
      }));
      actions.push(new fromSaveFilterModalActions.OpenSaveModal());

      return actions;
    })
  );

  @Effect()
  closeSaveModal$ = this.actions$
  .pipe(
    ofType(fromSaveFilterModalActions.CLOSE_SAVE_MODAL),
    map((action: fromSaveFilterModalActions.CloseSaveModal) => {
      return new fromUserFilterActions.ClearUpsertError();
    })
  );

  @Effect()
  updateSavedFilterMetaInfo$ = this.actions$
  .pipe(
    ofType(fromSaveFilterModalActions.UPDATE_META_INFO),
    switchMap((action: fromSaveFilterModalActions.UpdateMetaInfo) => {
      const savedFilter = action.payload.savedFilter;
      return this.userFilterApiService.upsert({
        SavedFilter: {
          Name: savedFilter.Name,
          Id: savedFilter.Id,
          MetaInfo: action.payload.metaInfo
        },
        Type: this.userFilterTypeData.Type
      })
      .pipe(
        map(() => {
          return new fromSaveFilterModalActions.UpdateMetaInfoSuccess();
        }),
        catchError(response => {
          return of(
            new fromSaveFilterModalActions.UpdateMetaInfoError()
          );
        })
      );
    })
  );

  @Effect()
  saveFilterSuccess$ = this.actions$
  .pipe(
    ofType(fromUserFilterActions.UPSERT_SUCCESS),
    mergeMap(() => {
      const actions = [];
      actions.push(new fromSaveFilterModalActions.CloseSaveModal());
      actions.push(new fromUserFilterActions.GetAll());
      return actions;
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromUserFilterReducer.State>,
    private userFilterApiService: UserFilterApiService,
    private userFilterTypeData: UserFilterTypeData
  ) { }
}
