import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { JobDescriptionApiService, JobDescriptionManagementApiService } from 'libs/data/payfactors-api/jdm';
import { ControlLabelResponse } from 'libs/models/payfactors-api/job-description-management/response';

import * as fromBulkExportPopoverActions from '../actions/bulk-export-popover.actions';
import * as fromJobInformationFieldsActions from '../actions/job-information-fields.actions';
import * as fromBulkExportPopoverReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../../shared/helpers';

@Injectable()
export class BulkExportPopoverEffects {
  @Effect()
  openBulkExportPopover$: Observable<Action> = this.actions$
    .ofType(fromBulkExportPopoverActions.OPEN_BULK_EXPORT_POPOVER).pipe(
      switchMap((action: fromBulkExportPopoverActions.OpenBulkExportPopover) =>
        this.jobDescriptionApiService.isBulkExportAvailable(action.payload).pipe(
          mergeMap((response: boolean) => {
            const actions = [];

            actions.push(new fromBulkExportPopoverActions.LoadViewNames(null));
            actions.push(new fromJobInformationFieldsActions.LoadJobInformationFieldsForBulkExport(null));

            if (response) {
              actions.push(new fromBulkExportPopoverActions.LoadControlLabels(null));
            } else {
              actions.push(new fromBulkExportPopoverActions.NoPublishedJobDescriptions());
            }

            return actions;
          }),
          catchError(response => of(new fromBulkExportPopoverActions.OpenBulkExportPopoverError()))
        )
      ));

  @Effect()
  loadViewNames$: Observable<Action> = this.actions$
    .ofType(fromBulkExportPopoverActions.LOAD_VIEW_NAMES).pipe(
      switchMap((action: fromBulkExportPopoverActions.LoadViewNames) =>
        this.jobDescriptionManagementApiService.getViewNames(action.payload).pipe(
          map((response: string[]) => {
            return new fromBulkExportPopoverActions.LoadViewNamesSuccess(response);
          }),
          catchError(response => of(new fromBulkExportPopoverActions.LoadViewNamesError()))
        )
      ));

  @Effect()
  loadControlLabels$: Observable<Action> = this.actions$
    .ofType(fromBulkExportPopoverActions.LOAD_CONTROL_LABELS).pipe(
      switchMap((action: fromBulkExportPopoverActions.LoadControlLabels) =>
        this.jobDescriptionManagementApiService.getDistinctControlLabels(action.payload).pipe(
          map((response: ControlLabelResponse[]) => {
            const controlLabelList =  PayfactorsApiModelMapper.mapControlLabelResponseListToControlLabelList(response);
            return new fromBulkExportPopoverActions.LoadControlLabelsSuccess(controlLabelList);
          }),
          catchError(response => of(new fromBulkExportPopoverActions.LoadControlLabelsError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private jobDescriptionApiService: JobDescriptionApiService,
    private jobDescriptionManagementApiService: JobDescriptionManagementApiService,
    private store: Store<fromBulkExportPopoverReducer.State>,
  ) {}
}
