import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { StructureModelingApiService } from 'libs/data/payfactors-api/structures';
import { AddGradeRangeRequest } from 'libs/models/payfactors-api/structures/request/add-grade-range-request.model';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromAddGradeModalActions from '../actions/add-grade-modal.actions';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';


//TODO: HIT THE CORRECT ENDPOINT, AND HANDLE AS EXPECTED
@Injectable()
export class AddGradeModalEffects {

  @Effect()
  addGrade$: Observable<Action> = this.actions$
    .pipe(
      ofType<fromAddGradeModalActions.AddGrade>(fromAddGradeModalActions.ADD_GRADE),
      withLatestFrom(
        this.store.pipe(select(fromSharedStructuresReducer.getMetadata)),
        this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
        this.store.pipe(select(fromPfDataGridReducer.getData)),
        this.store.pipe(select(fromPfDataGridReducer.getPagingOptions)),
        (action, metadata: RangeGroupMetadata, gridConfig: GridConfig, gridData: GridDataResult,
          pagingOptions: PagingOptions) => {
          return { action, metadata, gridConfig, gridData, pagingOptions };
        }
      ),
      switchMap((data) => {
        const request: AddGradeRangeRequest = {
          GradeName: data.action.payload.gradeName,
          StructuresRangeGroupId: data.action.payload.rangeGroupId
        };
        return this.structureModelingApiService.addGrade(request).pipe(
          mergeMap((response) => {
              const actions = [];

              if (!response.ValidationResult.Pass && response.ValidationResult.FailureReason === 'Grade Name Exists') {
                actions.push(new fromAddGradeModalActions.GradeNameExistsFailure());
              } else {
                const modelPageViewId =
                PagesHelper.getModelPageViewIdByRangeTypeAndRangeDistributionType(data.metadata.RangeTypeId, data.metadata.RangeDistributionTypeId);

                actions.push(new fromAddGradeModalActions.ClearGradeNameExistsFailure());
                actions.push(new fromAddGradeModalActions.CloseModal());
                actions.push(new fromModelSettingsModalActions.GetGradesDetails(data.action.payload.rangeGroupId));
                actions.push(GridDataHelper.getLoadDataAction(modelPageViewId, data.gridData, data.gridConfig, data.pagingOptions));
                actions.push(new fromAddGradeModalActions.AddGradeSuccess());
              }

              return actions;
            }
          ),
          catchError(() => of(new fromAddGradeModalActions.AddGradeError()))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private structureModelingApiService: StructureModelingApiService,
    private store: Store<fromSharedStructuresReducer.State>
  ) {}
}