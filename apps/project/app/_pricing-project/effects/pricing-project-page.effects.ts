import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PricingProjectApiService } from 'libs/data/payfactors-api/project';
import { ProjectExportRequest } from 'libs/models/projects/project-export-manager';
import { DataGridState } from 'libs/features/grids/pf-data-grid/reducers/pf-data-grid.reducer';
import { BaseProjectFields, getDefaultReferencePoints, PricingProjectReferencePoints, SaveProjectFieldRequest } from 'libs/models';
import { DataView, DataViewField, DataViewFieldType, DataViewType, SaveCompositeFieldsRequest, ViewField } from 'libs/models/payfactors-api';
import { SaveProjectFieldsResponse } from 'libs/models/projects/api';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromProjectTemplateActions from 'libs/features/projects/project-template-management/actions';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';

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
            ReferencePoints: this.getReferencePointCollectionFromProject(data.project.Project)
          };
          return [
            new fromProjectTemplateActions.SetBaseProjectFields(projectFieldMetaData),
            new fromProjectTemplateActions.ShowProjectTemplateForm(true)
          ];
        })
      );
    })
  );

  @Effect()
  saveProjectFields$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectTemplateActions.SAVE_BASE_PROJECT_FIELD_SELECTIONS),
    withLatestFrom(
      this.store.pipe(select(fromPfDataGridReducer.getFields, PageViewIds.ProjectJobs)),
      this.store.pipe(select(fromPricingProjectReducer.getPricingProject)),
      this.store.pipe(select(fromPfDataGridReducer.getBaseEntity, PageViewIds.ProjectJobs)),
      this.store.pipe(select(fromPfDataGridReducer.getGridConfig)),
      this.store.pipe(select(fromPfDataGridReducer.getSortDescriptor, PageViewIds.ProjectJobs)),
      (action: fromProjectTemplateActions.SaveBaseProjectFieldSelections, allFields, project, baseEntity, gridConfig, sortDescriptor) =>
        ({ action, allFields, project, baseEntity, gridConfig, sortDescriptor })
    ),
    switchMap((data) => {
        const dataView = this.buildProjectViewToSave(data.allFields, data.action.payload, data.sortDescriptor, data.baseEntity.Id);
        const request: SaveProjectFieldRequest = {
          ProjectId: data.project.Project.Id,
          ReferencePoints: this.buildReferencePointObjectFromSaveRequest(data.action.payload),
          ProjectDataView: dataView
        };

        return this.pricingProjectApiService.saveProjectFields(request).pipe(
          mergeMap((response: SaveProjectFieldsResponse) => {
              // Projects page by default has 2 fields in the descriptor. First by job title, then by pay market.
              // If we only have 1 field here, the grid was manually sorted
              // Maintain that sort so that saving columns and refreshing data doesn't clear sorts.
              const gridSorted = data.sortDescriptor.length === 1;
              const sortToMaintain = gridSorted ? data.sortDescriptor[0] : null;
              return this.reApplySortToProjectFieldResponseAndLoadData(response, sortToMaintain);
            }
          )
        );
      }
    )
  );

  getReferencePointCollectionFromProject(project: any) {
    return [
      project.BaseReferencePoint,
      project.TCCReferencePoint,
      project.BonusReferencePoint,
      project.TCCTargetReferencePoint,
      project.LTIPReferencePoint,
      project.TDCReferencePoint,
      project.AllowReferencePoint,
      project.FixedReferencePoint,
      project.RemunReferencePoint,
      project.TGPReferencePoint,
      project.BonusTargetReferencePoint,
      project.TargetLTIPReferencePoint,
      project.TargetTDCReferencePoint,
      project.SalesIncentiveActualPctReferencePoint,
      project.SalesIncentiveTargetPctReferencePoint,
      project.TCCPlusAllowReferencePoint,
      project.TCCPlusAllowNoCarReferencePoint,
      project.TCCTargetPlusAllowReferencePoint,
      project.TCCTargetPlusAllowNoCarReferencePoint,
      project.LTIPPctReferencePoint,
      project.BonusPctReferencePoint,
      project.BonusTargetPctReferencePoint,
      project.SalesIncentiveActualReferencePoint,
      project.SalesIncentiveTargetReferencePoint
    ];
  }

  // The request comes in with all 24 reference points as CategoryRefPt as well as the collection of selected field IDs
  // We need to remove the selected field IDs from this object, and translate the key names to CategoryReferencePoint for the API
  buildReferencePointObjectFromSaveRequest(request: SaveCompositeFieldsRequest): PricingProjectReferencePoints {
    const mrpRequestProperties = Object.keys(request).filter(x => x.indexOf('RefPt') > -1);
    const result: PricingProjectReferencePoints = getDefaultReferencePoints();
    mrpRequestProperties.forEach(x => {
      const oldKey = x;
      const newKey = x.replace('RefPt', 'ReferencePoint');
      result[newKey] = request[oldKey];
    });

    return result;
  }

  buildProjectViewToSave(allFields: ViewField[], saveRequest: SaveCompositeFieldsRequest,
                         sortDescriptor: SortDescriptor[], baseEntityId: number) {
    const selectedElements = allFields.filter(x => saveRequest.CompositeFieldIds.indexOf(x.DataElementId) > -1 || x.IsLocked);
    const dataView: DataView = {
      BaseEntityId: baseEntityId,
      PageViewId: PageViewIds.ProjectJobs,
      Name: null,
      Type: DataViewType.project,
      Filters: [],
      Elements: selectedElements.map(x => {
        const result: DataViewField = {
          EntityId: x.EntityId,
          Entity: null,
          EntitySourceName: x.EntitySourceName,
          DataElementId: x.DataElementId,
          SourceName: x.SourceName,
          DisplayName: x.DisplayName,
          DataType: x.DataType,
          IsSelected: x.IsSelected,
          IsSortable: false,
          Order: x.DefaultOrder,
          FieldType: DataViewFieldType.DataElement,
          SortOrder: null,
          SortDirection: null,
          Width: null
        };

        return result;
      })
    };

    return dataView;
  }

  reApplySortToProjectFieldResponseAndLoadData(response: SaveProjectFieldsResponse, sortToMaintain: SortDescriptor): Action[] {
    response.ViewConfiguration.Fields.forEach(x => {
      x.SortOrder = sortToMaintain && sortToMaintain?.field === `${x.EntitySourceName}_${x.SourceName}` ? 0 : null;
      x.SortDirection = sortToMaintain && sortToMaintain?.field === `${x.EntitySourceName}_${x.SourceName}` ? sortToMaintain?.dir : null;
    });

    return [
      new fromPfDataGridActions.LoadViewConfigSuccess(PageViewIds.ProjectJobs, response.ViewConfiguration),
      new fromPricingProjectActions.UpdateProject(response.Project),
      new fromProjectTemplateActions.ShowProjectTemplateForm(false),
      new fromProjectTemplateActions.SaveBaseProjectFieldSelectionsSuccess(),
      new fromPfDataGridActions.LoadData(PageViewIds.ProjectJobs),
    ];
  }
}
