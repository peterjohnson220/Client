import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { catchError, mergeMap, switchMap, withLatestFrom, concatMap, groupBy } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { PricingApiService, PricingEdmxApiService, DataViewApiService } from 'libs/data/payfactors-api';
import { ViewField, DataViewFieldDataType } from 'libs/models/payfactors-api';
import { DataGridToDataViewsHelper } from 'libs/features/pf-data-grid/helpers';
import { DataGridState } from 'libs/features/pf-data-grid/reducers/pf-data-grid.reducer';

import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromModifyPricingsActions from '../actions';
import * as fromModifyPricingsReducer from '../reducers';
import { PageViewIds } from '../constants';


@Injectable()
export class ModifyPricingsEffects {

  constructor(
    private actions$: Actions,
    private pricingEdmxApiService: PricingEdmxApiService,
    private pricingApiService: PricingApiService,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromModifyPricingsReducer.State>,
  ) { }

  @Effect()
  deletePricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromModifyPricingsActions.DELETING_PRICING),
    switchMap((action: any) => {
      return this.pricingEdmxApiService.deletePricing(action.payload).pipe(
        mergeMap(() => [
          new fromModifyPricingsActions.DeletingPricingSuccess(),
          new fromPfDataGridActions.LoadData(PageViewIds.PricingHistory),
          new fromPfDataGridActions.LoadData(PageViewIds.PayMarkets)
        ]),
        catchError(error => of(new fromModifyPricingsActions.DeletingPricingError(error))),
      );
    })
  );

  @Effect()
  deletePricingMatch$: Observable<Action> = this.actions$.pipe(
    ofType<fromModifyPricingsActions.DeletingPricingMatch>(fromModifyPricingsActions.DELETING_PRICING_MATCH),
    mergeMap((a: fromModifyPricingsActions.DeletingPricingMatch) =>
      of(a).pipe(
        withLatestFrom(
          this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.PayMarkets)),
          (action: fromModifyPricingsActions.DeletingPricingMatch,
            paymarketsGridState: DataGridState
          ) => ({ action, paymarketsGridState })
        ))),
    switchMap((data) =>
      this.pricingApiService.deletePricingMatch(data.action.pricingMatchId)
        .pipe(
          concatMap((modifiedPricingsIds) => {
            return this.getDataForModifiedPricings(data.paymarketsGridState, modifiedPricingsIds);
          })
        )
        .pipe(
          mergeMap((updatedPricingData) => {
            const actions = this.getUpdatePricingActions(data.paymarketsGridState, updatedPricingData);
            actions.push(new fromModifyPricingsActions.DeletingPricingMatchSuccess());
            return actions;
          }),
        )
    ),
    catchError(error => of(new fromModifyPricingsActions.DeletingPricingMatchError(error)))
  );

  @Effect()
  updatePricingMatch$: Observable<Action> = this.actions$.pipe(
    ofType(fromModifyPricingsActions.UPDATING_PRICING_MATCH),
    groupBy((action: fromModifyPricingsActions.UpdatingPricingMatch) => action.pricingId),
    mergeMap(pricingIdGroup => pricingIdGroup.pipe(
      mergeMap((a: fromModifyPricingsActions.UpdatingPricingMatch) =>
        of(a).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getGrid, a.matchesGridPageViewId)),
            this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.PayMarkets)),
            (action: fromModifyPricingsActions.UpdatingPricingMatch,
              modifiedMatchGridState: DataGridState,
              paymarketsGridState: DataGridState
            ) => ({ action, modifiedMatchGridState, paymarketsGridState })
          ))),
      switchMap((data) =>
        this.getUpdatePricingMatchStrategy(data.action, data.modifiedMatchGridState, data.paymarketsGridState)
          .pipe(
            mergeMap((updatedRowData) => {
              return this.getUpdatePricingMatchActions(data.action.matchesGridPageViewId, data.modifiedMatchGridState,
                data.paymarketsGridState, updatedRowData);
            })
          )
      ),
      catchError(error => of(new fromModifyPricingsActions.UpdatingPricingMatchError(error)))
    ))
  );

  @Effect()
  updatePricing$: Observable<Action> = this.actions$.pipe(
    ofType(fromModifyPricingsActions.UPDATING_PRICING),
    groupBy((action: fromModifyPricingsActions.UpdatingPricing) => action.request.PricingId),
    mergeMap(pricingIdGroup => pricingIdGroup.pipe(
      mergeMap((a: fromModifyPricingsActions.UpdatingPricing) =>
        of(a).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.PayMarkets)),
            (action: fromModifyPricingsActions.UpdatingPricing, paymarketsGridState: DataGridState) => ({ action, paymarketsGridState })
          ))),
      switchMap((data) =>
        this.pricingApiService.updatePricing(data.action.request)
          .pipe(
            concatMap((modifiedPricingsIds) => {
              return this.getDataForModifiedPricings(data.paymarketsGridState, modifiedPricingsIds);
            })
          )
          .pipe(
            mergeMap((updatedRowData) => {
              const actions = this.getUpdatePricingActions(data.paymarketsGridState, updatedRowData, false);
              actions.push(new fromModifyPricingsActions.UpdatingPricingSuccess());
              return actions;
            })
          )
      ),
      catchError(error => of(new fromModifyPricingsActions.UpdatingPricingError(error)))
    ))
  );

  @Effect()
  RefreshLinkedPricings$: Observable<Action> = this.actions$.pipe(
    ofType(fromModifyPricingsActions.REFRESH_LINKED_PRICINGS),
    withLatestFrom(
      this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.PayMarkets)),
      (action: fromModifyPricingsActions.RefreshLinkedPricings, paymarketsGridState: DataGridState) => ({ action, paymarketsGridState })
    ),
    switchMap((data) => this.getDataForModifiedPricings(data.paymarketsGridState, data.action.pricingIds)
      .pipe(
        mergeMap((updatedRowData) => this.getUpdatePricingActions(data.paymarketsGridState, updatedRowData))
      )
    )
  );


  //#region UpdatePricingMatch HelperFunctions

  private getUpdatePricingMatchStrategy(
    action: fromModifyPricingsActions.UpdatingPricingMatch,
    modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState): Observable<[any, any]> {

    return this.pricingApiService.updatePricingMatch(action.request)
      .pipe(concatMap((modifiedPricingsIds) => {
        const idsForModifiedVisiblePricings = this.getIdsForVisiblePricings(paymarketsGridState.data.data, modifiedPricingsIds);
        return this.getDataForModifiedRows(action, modifiedMatchGridState, paymarketsGridState, idsForModifiedVisiblePricings);
      }));
  }

  private getDataForModifiedRows(
    action: fromModifyPricingsActions.UpdatingPricingMatch,
    modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState,
    idsForModifiedVisiblePricings: any[]): Observable<[any, any]> {

    return forkJoin([
      this.getModifiedDataRows(idsForModifiedVisiblePricings, 'CompanyJobs_Pricings', 'CompanyJobPricing_ID',
        paymarketsGridState.baseEntity.Id, paymarketsGridState.fields, paymarketsGridState.sortDescriptor),
      this.getModifiedDataRows([action.request.MatchId], 'CompanyJobs_PricingsMatches', 'CompanyJobPricingMatch_ID',
        modifiedMatchGridState.baseEntity.Id, modifiedMatchGridState.fields, modifiedMatchGridState.sortDescriptor)]
    );
  }

  private getUpdatePricingMatchActions(matchesGridPageViewId: string, modifiedMatchGridState: DataGridState,
    paymarketsGridState: DataGridState, updatedRowData: any): Action[] {

    const updatedPricingData = updatedRowData[0];
    const updatedMatchesData = updatedRowData[1];

    let actions: Action[] = [new fromModifyPricingsActions.UpdatingPricingMatchSuccess()];

    // Update Match Action
    actions = actions.concat(this.getActionsToUpdateRows(updatedMatchesData, modifiedMatchGridState.data,
      'CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID', matchesGridPageViewId, true));

    // Update Pricings Action
    actions = actions.concat(this.getUpdatePricingActions(paymarketsGridState, updatedPricingData, false));

    return actions;
  }

  //#endregion


  //#region Shared UpdatePricing Helper functions

  private getUpdatePricingActions(paymarketsGridState: DataGridState, updatedRowData: any[], reloadMatches = true): Action[] {
    let actions = this.getActionsToUpdateRows(updatedRowData, paymarketsGridState.data,
      'CompanyJobs_Pricings_CompanyJobPricing_ID', PageViewIds.PayMarkets);

    if (reloadMatches) {
      actions = actions.concat(this.getActionsToReloadPricingMatches(updatedRowData));
    }

    return actions;
  }

  private getIdsForVisiblePricings(payMarketsGridData: any[], modifiedPricingsIds: any[]) {
    return payMarketsGridData
      .filter(x => modifiedPricingsIds.includes(x.CompanyJobs_Pricings_CompanyJobPricing_ID))
      .map(x => x.CompanyJobs_Pricings_CompanyJobPricing_ID);
  }

  private getDataForModifiedPricings(paymarketsGridState: DataGridState, modifiedPricingsIds: any[]) {
    const idsForModifiedVisiblePricings = this.getIdsForVisiblePricings(paymarketsGridState.data.data, modifiedPricingsIds);
    return idsForModifiedVisiblePricings.length
      ? this.getModifiedDataRows(idsForModifiedVisiblePricings, 'CompanyJobs_Pricings', 'CompanyJobPricing_ID',
        paymarketsGridState.baseEntity.Id, paymarketsGridState.fields, paymarketsGridState.sortDescriptor)
      : of([]);
  }

  private getModifiedDataRows(
    modifiedIds: number[], filterEntity: string, filterField: string, baseEntityId: number,
    fields: ViewField[], sortDescriptor: SortDescriptor[]): Observable<any> {

    return this.dataViewApiService.getData(DataGridToDataViewsHelper.buildDataViewDataRequest(
      baseEntityId,
      fields,
      [{
        EntitySourceName: filterEntity,
        SourceName: filterField,
        DataType: DataViewFieldDataType.Int,
        Operator: 'in',
        Values: modifiedIds.map(String),
      }],
      { From: 0, Count: modifiedIds.length },
      sortDescriptor,
      false,
      false
    ));
  }

  private getActionsToReloadPricingMatches(updatedPricingData: any[]): any[] {
    const actions = [];
    updatedPricingData.forEach(modifiedPricing => {
      actions.push(new fromPfDataGridActions.LoadData(`${PageViewIds.PricingMatches}_${modifiedPricing.CompanyJobs_Pricings_CompanyJobPricing_ID}`));
    });
    return actions;
  }

  private getActionsToUpdateRows(updatedData: any[], currentData: GridDataResult,
    fieldId: string, pageViewId: string, refreshGridState: boolean = false): any[] {
    const actions = [];
    updatedData.forEach(modifiedRow => {
      const recordRowIndex = currentData.data.findIndex(o => o[fieldId] === modifiedRow[fieldId]);

      if (refreshGridState) {
        actions.push(new fromPfDataGridActions.UpdateRow(pageViewId, recordRowIndex, modifiedRow, null, true));
      } else {
        actions.push(new fromPfDataGridActions.UpdateGridDataRow(pageViewId, recordRowIndex, modifiedRow));
      }
    });
    return actions;
  }

  //#endregion

}

