import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { StructureModelingApiService, StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';
import { GridDataHelper } from 'libs/features/grids/pf-data-grid/helpers';
import * as fromDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { generateMockRangeAdvancedSetting, RangeGroupMetadata } from 'libs/models/structures';
import { GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import * as fromNotificationActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import * as fromJobsToGradeActions from 'libs/features/structures/add-jobs-to-range/actions/jobs-to-grade.actions';
import * as fromAddJobsReducer from 'libs/features/jobs/add-jobs/reducers';

import * as fromSharedGradeBasedReducer from '../reducers';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { UrlService } from '../../../shared/services';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import { Workflow } from '../../../shared/constants/workflow';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';
import { PayfactorsApiModelMapper } from '../../../shared/helpers/payfactors-api-model-mapper';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromGradeBasedSharedActions from '../actions/shared.actions';

@Injectable()
export class SharedEffects {

  @Effect()
  getCurrentRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType(fromSharedStructuresActions.GET_GRADE_RANGE_DETAILS),
      switchMap((action: fromSharedStructuresActions.GetGradeRangeDetails) => {
        return this.structureRangeGroupApiService.getDetails(action.payload)
          .pipe(
            map((res) => {
              return new fromSharedStructuresActions.GetGradeRangeDetailsSuccess(res);
            }),
            catchError((err) => of(new fromSharedStructuresActions.GetGradeRangeDetailsError(err)))
          );
      })
    );

  @Effect()
  reloadRangeGroup: Observable<Action> = this.actions$
    .pipe(
      ofType<fromJobsToGradeActions.SaveGradeJobMapsSuccess>(fromJobsToGradeActions.SAVE_GRADE_JOB_MAPS_SUCCESS),
      withLatestFrom(
        this.store.select(fromAddJobsReducer.getContextStructureRangeGroupId),
        (action, contextStructureRangeGroupId: number) => {
          return { action, contextStructureRangeGroupId };
        }
      ),
      switchMap((data) => {
        return this.structureRangeGroupApiService.getDetails(data.contextStructureRangeGroupId)
          .pipe(
            map((res) => {
              return new fromSharedStructuresActions.GetGradeRangeDetailsSuccess(res);
            }),
            catchError((err) => of(new fromSharedStructuresActions.GetGradeRangeDetailsError(err)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromSharedGradeBasedReducer.State>,
    private structureRangeGroupApiService: StructureRangeGroupApiService
  ) { }
}
