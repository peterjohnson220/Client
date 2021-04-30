import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { PricingProjectApiService } from 'libs/data/payfactors-api/project';
import { ProjectExportRequest } from 'libs/models/projects/project-export-manager';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { DataGridState } from 'libs/features/grids/pf-data-grid/reducers/pf-data-grid.reducer';

import * as fromPricingProjectActions from '../actions';
import * as fromPricingProjectReducer from '../reducers';
import { PageViewIds } from 'apps/project/app/shared/constants';

@Injectable()
export class PricingProjectPageEffects {
  constructor(private actions$: Actions,
              private pricingProjectApiService: PricingProjectApiService,
              private store: Store<fromPricingProjectReducer.State>
  ) {}

  @Effect()
  queuePricingProjectExport$: Observable<Action> = this.actions$.pipe(
    ofType(fromPricingProjectActions.QUEUE_PRICING_PROJECT_EXPORT),
    withLatestFrom(
      this.store.pipe(select(fromPricingProjectReducer.getPricingProject)),
      this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.ProjectJobs)),
      (action: fromPricingProjectActions.QueuePricingProjectExport, project: any, projectJobGrid: DataGridState) => ({action, project, projectJobGrid})
    ),
    switchMap((data: any) => {
      const request: ProjectExportRequest = {
        ProjectId: data.project.Id,
        ProjectTemplateId: data.action.payload.ProjectTemplateId,
        DataSources: data.action.payload.DataSources,
        ProjectJobIds: [],
        FileType: data.action.payload.FileType,
        PageViewId: PageViewIds.ProjectJobs
      };

      // TODO: only export selected jobs once pricing project grid checkboxes are hooked up.
      data.projectJobGrid.data.data.forEach(dataPoint => {
        request.ProjectJobIds.push(dataPoint.vw_ProjectJobPayMarketMetadata_UserJobListTemp_ID);
      });

      return this.pricingProjectApiService.exportPricingProject(request).pipe(
        map(() => new fromPricingProjectActions.QueuePricingProjectExportSuccess())
      );
    }),
    catchError((error) => of(new fromPricingProjectActions.QueuePricingProjectExportError(error)))
  );
}
