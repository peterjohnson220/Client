import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { TagApiService } from 'libs/data/payfactors-api/tags';

import { GridHelperService } from '../services';
import * as fromTagCategoriesActions from '../actions/tag-categories.actions';
import * as fromPeerAdminReducer from '../reducers';

@Injectable()
export class TagCategoriesEffects {
  @Effect()
  loadTagCategories$: Observable<Action> = this.actions$.pipe(
    ofType(fromTagCategoriesActions.LOAD_TAG_CATEGORIES),
    map((action: fromTagCategoriesActions.LoadTagCategories) => action.payload),
    switchMap((payload) => {
        return this.tagApiService.getTagCategories(payload.exchangeId, payload.listState).pipe(
          map((tagCategoriesResult: GridDataResult) => {
            return new fromTagCategoriesActions.LoadTagCategoriesSuccess(tagCategoriesResult);
          }),
          catchError(error => of(new fromTagCategoriesActions.LoadTagCategoriesError()))
        );
      }
    )
  );

  @Effect()
  createTagCategory$: Observable<Action> = this.actions$.pipe(
    ofType(fromTagCategoriesActions.CREATE_TAG_CATEGORY),
    map((action: fromTagCategoriesActions.CreateTagCategory) => action.payload),
    withLatestFrom(
      this.peerAdminStore.pipe(select(fromPeerAdminReducer.getTagCategoriesGridState)),
      (action, gridState) => {
        return {action, gridState};
      }
    ),
    switchMap(payload => {
        return this.tagApiService.createTagCategory(payload.action).pipe(
          map(() => {
            this.gridHelperService.loadTagCategories({
              exchangeId: -1,
              listState: payload.gridState
            });
            return new fromTagCategoriesActions.CreateTagCategorySuccess();
          }),
          catchError(error => of(new fromTagCategoriesActions.CreateTagCategoryError()))
        );
      }
    )
  );

  @Effect()
  addTagCategoriesToExchange$: Observable<Action> = this.actions$.pipe(
    ofType(fromTagCategoriesActions.ADD_TAG_CATEGORIES_TO_EXCHANGE),
    map((action: fromTagCategoriesActions.AddTagCategoriesToExchange) => action.payload),
    switchMap((payload) => {
        return this.tagApiService.addTagCategoriesToExchange(payload).pipe(
          map(() => {
            this.gridHelperService.loadExchangeFilters(payload.ExchangeId, '');
            return new fromTagCategoriesActions.AddTagCategoriesToExchangeSuccess();
          }),
          catchError(error => of(new fromTagCategoriesActions.AddTagCategoriesToExchangeError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private tagApiService: TagApiService,
    private gridHelperService: GridHelperService,
    private peerAdminStore: Store<fromPeerAdminReducer.State>
  ) {}
}
