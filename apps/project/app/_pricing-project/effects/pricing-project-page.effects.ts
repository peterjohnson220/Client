import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { PricingProjectApiService } from 'libs/data/payfactors-api/project';
import { ProjectExportRequest } from 'libs/models/projects/project-export-manager';
import { DataGridState } from 'libs/features/grids/pf-data-grid/reducers/pf-data-grid.reducer';
import { BaseProjectFields } from 'libs/models';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromProjectTemplateActions from 'libs/features/projects/project-template-management/actions';

import { PageViewIds } from '../../shared/constants';
import * as fromPricingProjectActions from '../actions';
import * as fromPricingProjectReducer from '../reducers';



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

  @Effect()
  getProjectFieldsForColumnChooser$: Observable<Action> = this.actions$.pipe(
    ofType(fromPricingProjectActions.GET_PROJECT_FIELDS_FOR_COLUMN_CHOOSER),
    withLatestFrom(
      this.store.pipe(select(fromPricingProjectReducer.getPricingProject)),
      (action: fromPricingProjectActions.GetProjectFieldsForColumnChooser, project) =>
        ({ action, project })
    ),
    switchMap((data) => {
      return this.pricingProjectApiService.getProjectFieldsForColumnChooser(data.action.payload).pipe(
        mergeMap(response => {
          const projectFieldMetaData: BaseProjectFields = {
            TemplateFields: response,
            ReferencePoints: [
              data.project.BaseReferencePoint,
              data.project.TCCReferencePoint,
              data.project.BonusReferencePoint,
              data.project.TCCTargetReferencePoint,
              data.project.LTIPReferencePoint,
              data.project.TDCReferencePoint,
              data.project.AllowReferencePoint,
              data.project.FixedReferencePoint,
              data.project.RemunReferencePoint,
              data.project.TGPReferencePoint,
              data.project.BonusTargetReferencePoint,
              data.project.TargetLTIPReferencePoint,
              data.project.TargetTDCReferencePoint,
              data.project.SalesIncentiveActualPctReferencePoint,
              data.project.SalesIncentiveTargetPctReferencePoint,
              data.project.TCCPlusAllowReferencePoint,
              data.project.TCCPlusAllowNoCarReferencePoint,
              data.project.TCCTargetPlusAllowReferencePoint,
              data.project.TCCTargetPlusAllowNoCarReferencePoint,
              data.project.LTIPPctReferencePoint,
              data.project.BonusPctReferencePoint,
              data.project.BonusTargetPctReferencePoint,
              data.project.SalesIncentiveActualReferencePoint,
              data.project.SalesIncentiveTargetReferencePoint
            ]
          };
          return [
            new fromProjectTemplateActions.SetBaseProjectFields(projectFieldMetaData),
            new fromProjectTemplateActions.ShowProjectTemplateForm(true)
          ];
        })
      );
    })
  );
}
