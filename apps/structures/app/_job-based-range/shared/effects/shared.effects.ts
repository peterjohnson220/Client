import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, mergeMap, catchError, withLatestFrom, tap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import * as pfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

import * as fromSharedJobBasedRangeActions from '../actions/shared.actions';
import * as fromSharedJobBasedReducer from '../reducers';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import { UrlService } from '../../../shared/services';

@Injectable()
export class SharedEffects {

  @Effect()
  recalculateRangesWithoutMid$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.RECALCULATE_RANGES_WITHOUT_MID),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action: fromSharedStructuresActions.RecalculateRangesWithoutMid, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
         pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data) => {
          return this.structureModelingApiService.recalculateRangesWithoutMid(data.action.payload)
            .pipe(
              mergeMap(() => {
                const actions = [];
                const modelPageViewId =
                  PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

                actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));

                actions.push(new fromSharedStructuresActions.GetOverriddenRanges({
                  pageViewId: modelPageViewId,
                  rangeGroupId: data.action.payload
                }));

                return actions;
              }),
            );
        }
      ));

  // We want to remove filterQuery param otherwise Saved filter won't be applied
  @Effect({ dispatch: false })
  handleSavedViewClicked$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPfDataGridActions.HANDLE_SAVED_VIEW_CLICKED),
      tap((action: fromPfDataGridActions.HandleSavedViewClicked) => {
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: { },
            queryParamsHandling: ''
          });
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedJobBasedReducer.State>,
    private structureModelingApiService: StructureModelingApiService,
    private router: Router,
    private urlService: UrlService,
    private route: ActivatedRoute
  ) { }
}
