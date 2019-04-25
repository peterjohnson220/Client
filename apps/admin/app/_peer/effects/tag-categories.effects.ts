import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { TagApiService } from 'libs/data/payfactors-api/tags';

import { GridHelperService } from '../services';
import * as fromTagCategoriesActions from '../actions/tag-categories.actions';

@Injectable()
export class TagCategoriesEffects {
  @Effect()
  loadTagCategories$: Observable<Action> = this.actions$.pipe(
    ofType(fromTagCategoriesActions.LOAD_TAG_CATEGORIES),
    map((action: fromTagCategoriesActions.LoadTagCategories) => action.payload),
    switchMap((payload) => {
        return this.tagApiService.getAllTagCategories(payload).pipe(
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
    switchMap((payload) => {
        return this.tagApiService.createTagCategory(payload).pipe(
          map(() => {
            this.gridHelperService.loadTagCategories('');
            return new fromTagCategoriesActions.CreateTagCategorySuccess();
          }),
          catchError(error => of(new fromTagCategoriesActions.CreateTagCategoryError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private tagApiService: TagApiService,
    private gridHelperService: GridHelperService
  ) {}
}
