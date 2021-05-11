import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { StructureMappingApiService, StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromSwitchRegressionFlagsReducer from '../../shared/reducers';
import * as fromSwitchRegressionFlagsActions from '../../shared/actions/switch-regression-flags-modal.actions';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';
import { PagesHelper } from '../../../shared/helpers/pages.helper';


@Injectable()
export class SwitchRegressionFlagsModalEffects {

  @Effect()
  switchRegressionFlags: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSwitchRegressionFlagsActions.SWITCH_REGRESSION_FLAGS),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        this.store.pipe(select(fromSharedStructuresReducer.getFormulaValid)),
        (action: fromSwitchRegressionFlagsActions.SwitchRegressionFlags, metadata, gridConfig, gridData, pagingOptions) =>
          ({ action, metadata, gridConfig, gridData, pagingOptions })
      ),
      switchMap((data) => {
        return this.structureMappingApiService.switchRegressionFlags(data.action.payload)
          .pipe(
            mergeMap(() => this.getSwitchRegressionFlagsActions(data)),
            catchError((err) => of(new fromSwitchRegressionFlagsActions.SwitchRegressionFlagsError(err)))
          );
      })
    );

  @Effect()
  reloadRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSwitchRegressionFlagsActions.SWITCH_REGRESSION_FLAGS_SUCCESS),
      switchMap((action: fromSwitchRegressionFlagsActions.SwitchRegressionFlagsSuccess) => {
        return this.structureRangeGroupApiService.getDetails(action.rangeGroupId)
          .pipe(
            map((res) => {
              return new fromSharedStructuresActions.GetGradeRangeDetailsSuccess(res);
            }),
            catchError((err) => of(new fromSharedStructuresActions.GetGradeRangeDetailsError(err)))
          );
      })
    );


  private getSwitchRegressionFlagsActions(data: any): Action[] {
    const actions = [];
    actions.push(new fromSwitchRegressionFlagsActions.SwitchRegressionFlagsSuccess(data.action.payload.CompanyStructuresRangeGroupId));
    actions.push(new fromSwitchRegressionFlagsActions.CloseModal());
    const modelPageViewId =
      PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);
    actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));
    return actions;
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromSwitchRegressionFlagsReducer.State>,
    private structureMappingApiService: StructureMappingApiService,
    private structureRangeGroupApiService: StructureRangeGroupApiService
  ) { }
}
