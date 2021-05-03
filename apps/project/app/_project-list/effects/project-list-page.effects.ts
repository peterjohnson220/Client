import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { switchMap, mergeMap, withLatestFrom, catchError, map } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { ToastrService } from 'ngx-toastr';

import { PricingProjectApiService } from 'libs/data/payfactors-api/project';
import { DataGridState} from 'libs/features/grids/pf-data-grid/reducers/pf-data-grid.reducer';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { BulkProjectShareRequest } from 'libs/models/share-modal/bulk-project-share-request';

import * as fromProjectListPageActions from '../actions';
import * as fromProjectListPageReducer from '../reducers';

import { PageViewIds } from '../../shared/constants';

@Injectable()
export class ProjectListPageEffects {

  private readonly toastrOverrides = {
    positionClass: 'toast-top-center',
    tapToDismiss: true,
    enableHtml: true,
    preventDuplicates: true,
    preventOpenDuplicates: true,
    closeButton: true,
    showMethod: 'fadeIn',
    disableTimeOut: true,
  };

  constructor(
    private actions$: Actions,
    private pricingProjectApiService: PricingProjectApiService,
    private store: Store<fromProjectListPageReducer.State>,
    private toastr: ToastrService) {
  }

  @Effect()
  togglePinOnDashboard$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectListPageActions.TOGGLE_PIN_ON_DASHBOARD),
    withLatestFrom(
      this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.Projects)),
      (action: fromProjectListPageActions.TogglePinOnDashboard, projectListGridState: DataGridState) => ({action, projectListGridState})
    ),
    switchMap((data: any) => {
      return this.pricingProjectApiService.togglePinToDashboard(data.action.payload).pipe(
        mergeMap(() => {
          const actions = [];
          actions.push(new fromProjectListPageActions.TogglePinOnDashboardSuccess());

          const rowToUpdate = data.projectListGridState.data.data.find(x => x['UserSessionMap_UserSession_ID'] === data.action.payload);
          const rowIndexToUpdate = data.projectListGridState.data.data.findIndex(x => x === rowToUpdate);

          const currentPinStatus = !!rowToUpdate['UserSessionMap_PinOnDashboard'];
          const clonedRow = cloneDeep(rowToUpdate);
          clonedRow['UserSessionMap_PinOnDashboard'] = !currentPinStatus;

          actions.push(new fromPfDataGridActions.UpdateRow(PageViewIds.Projects, rowIndexToUpdate, clonedRow, null, true));

          return actions;
        })
      );
    }),
    catchError(error => {
      return this.handleError('pinning your project', 'Error', new fromPfDataGridActions.DoNothing(PageViewIds.Projects));
    })
  );

  @Effect()
  copyProject$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectListPageActions.COPY_PROJECT),
    switchMap((action: fromProjectListPageActions.CopyProject) => {
      return this.pricingProjectApiService.copyProject(action.payload).pipe(
        mergeMap(() => {
          const actions = [];
          actions.push(new fromProjectListPageActions.CopyProjectSuccess());
          actions.push(new fromPfDataGridActions.LoadData(PageViewIds.Projects));
          return actions;
        })
      );
    }),
    catchError(error => {
      return this.handleError('copying your project', 'Error', new fromPfDataGridActions.DoNothing(PageViewIds.Projects));
    })
  );

  @Effect()
  deleteProjects$: Observable<Action> = this.actions$.pipe(
    ofType(fromProjectListPageActions.DELETE_PROJECTS),
    switchMap((action: fromProjectListPageActions.DeleteProjects) => {
      return this.pricingProjectApiService.deleteProjects(action.payload).pipe(
        mergeMap(() => {
          const actions = [];
          actions.push(new fromProjectListPageActions.DeleteProjectsSuccess());
          actions.push(new fromPfDataGridActions.LoadData(PageViewIds.Projects));
          return actions;
        }),
        catchError(error => {
          return this.handleError('deleting your project', 'Error', new fromPfDataGridActions.DoNothing(PageViewIds.Projects));
        })
      );
    })
  );

  @Effect()
  bulkProjectShare$ = this.actions$
    .pipe(
      ofType(fromProjectListPageActions.BULK_PROJECT_SHARE),
      switchMap((action: fromProjectListPageActions.BulkProjectShare) => {
        // withLatestFrom is dependant on action.pageViewId to get selectedRecordIds. Nest it within a switchMap to give it access to the action.
        return of(action).pipe(
          withLatestFrom(
            this.store.select(fromPfDataGridReducer.getSelectedKeys, PageViewIds.Projects),
            this.store.select(fromProjectListPageReducer.getSingleProjectShareId),
            (autoShareAction: fromProjectListPageActions.BulkProjectShare, selectedRecordIds: number[], shareIdFromRowAction: number) =>
              ({autoShareAction, selectedRecordIds, shareIdFromRowAction}) // Return new observable with only what is required for the subsequent switchMap.
          )
        );
      }),
      switchMap((data) => {
        let projectIds: number[] = [];

        if (data.shareIdFromRowAction != null) {
          projectIds.push(data.shareIdFromRowAction);
        } else {
          projectIds = data.selectedRecordIds;
        }

        const request: BulkProjectShareRequest = {
          UserIds: data.autoShareAction.payload.UserIds,
          ProjectIds: projectIds,
          Message: data.autoShareAction.customMessage
        };

        return this.pricingProjectApiService.bulkProjectShare(request)
          .pipe(
            mergeMap(() => {
              return [
                new fromProjectListPageActions.ClearSingleProjectShareId(),
                new fromProjectListPageActions.BulkProjectShareSuccess(),
                new fromPfDataGridActions.LoadData(PageViewIds.Projects)
              ];
            }),
            catchError(error => {
              return this.handleError('sharing your project', 'Error', new fromProjectListPageActions.BulkProjectShareError());
            })
          );
      })
    );

  @Effect()
  getTooltipContent$ = this.actions$
    .pipe(
      ofType(fromProjectListPageActions.GET_TOOLTIP_CONTENT),
      switchMap((action: fromProjectListPageActions.GetTooltipContent) => {
        return this.pricingProjectApiService.getTooltipContent(action.payload).pipe(
          map(response => new fromProjectListPageActions.GetTooltipContentSuccess(response)),
          catchError(error => {
            return this.handleError('retrieving project information', 'Error', new fromProjectListPageActions.GetTooltipContentError());
          })
        );
      })
    );

  private handleError(message: string, title: string = 'Error',
                      resultingAction: Action = new fromPfDataGridActions.DoNothing(PageViewIds.Projects)
  ): Observable<Action> {
    const errorMessage = `We encountered an error when ${message}. Please contact Payfactors support for assistance.`;
    const toastContent = `<div class="message-container"><div class="alert-triangle-icon mr-3"></div>${errorMessage}</div>`;
    this.toastr.error(toastContent, title, this.toastrOverrides);
    return of(resultingAction);
  }
}
