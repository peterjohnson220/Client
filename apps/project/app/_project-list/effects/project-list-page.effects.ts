import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { PricingProjectApiService } from 'libs/data/payfactors-api/project';
import { DataGridState} from 'libs/features/pf-data-grid/reducers/pf-data-grid.reducer';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromProjectListPageActions from '../actions';
import * as fromProjectListPageReducer from '../reducers';

import { PageViewIds } from '../constants';

@Injectable()
export class ProjectListPageEffects {
  constructor(
    private actions$: Actions,
    private pricingProjectApiService: PricingProjectApiService,
    private store: Store<fromProjectListPageReducer.State>) {
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
    })
  );


}
