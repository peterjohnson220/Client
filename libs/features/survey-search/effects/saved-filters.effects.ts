import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { UserFilterApiService } from 'libs/data/payfactors-api/user';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';
import * as fromSearchResultsActions from 'libs/features/search/actions/search-results.actions';
import * as fromSaveFilterModalActions from 'libs/features/user-filter/actions/save-filter-modal.actions';
import * as fromUserFilterPopoverActions from 'libs/features/user-filter/actions/user-filter-popover.actions';
import { PayfactorsSearchApiModelMapper } from 'libs/features/search/helpers';
import { UserFilterTypeData } from 'libs/features/user-filter/models';
import * as fromUserFilterReducer from 'libs/features/user-filter/reducers';

import * as fromSurveySearchReducer from '../reducers';
import { SavedFilterHelper } from '../helpers';

@Injectable()
export class SavedFiltersEffects {

  @Effect()
  initSavedFilters$ = this.actions$
    .pipe(
      ofType(fromUserFilterActions.INIT),
      switchMap(() => {
        return this.userFilterApiService.getAll({ Type: this.userFilterTypeData.Type })
          .pipe(
            mergeMap(response => [
               new fromUserFilterActions.GetSuccess(
                 this.payfactorsSearchApiModelMapper.mapSearchSavedFilterResponseToSavedFilter(response)),
               new fromUserFilterActions.ApplyDefault()
            ])
          );
      })
    );

  @Effect()
  getSavedFiltersSuccess$ = this.actions$
    .pipe(
      ofType(fromUserFilterActions.GET_SUCCESS),
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        (action: fromUserFilterActions.GetSuccess, jobContext, pricingMatchDataSearchContext) =>
          ({action, jobContext, pricingMatchDataSearchContext})),
      mergeMap(data => {
        const actions = [];
        const savedFilters = data.action.payload;
        const payMarketId = data.pricingMatchDataSearchContext.PaymarketId;
        const defaultFilterForThisPayMarket = this.savedFilterHelper.getDefaultFilter(payMarketId, savedFilters);
        const defaultFilterId = defaultFilterForThisPayMarket ? defaultFilterForThisPayMarket.Id : '';
        actions.push(new fromUserFilterActions.SetDefault(defaultFilterId));
        return actions;
      })
    );

  @Effect()
  saveFilter$ = this.actions$
    .pipe(
      ofType(fromSaveFilterModalActions.SAVE),
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromUserFilterReducer.getSavedFilters),
        (action: fromSaveFilterModalActions.Save, jobContext, pricingMatchDataSearchContext, savedFilters) =>
          ({action, jobContext, pricingMatchDataSearchContext, savedFilters})),
      switchMap((data) => {
        const actions = [];
        const modalData = data.action.payload;
        const payMarketId = data.pricingMatchDataSearchContext.PaymarketId;
        const upsertRequest = this.savedFilterHelper.buildUpsertRequest(payMarketId, modalData);
        const isPayMarketDefault = this.savedFilterHelper.isPayMarketDefaultFilter(modalData.SavedFilter, payMarketId);
        let currentDefault = null;

        if (modalData.SetAsDefault && !isPayMarketDefault) {
          currentDefault = this.savedFilterHelper.getDefaultFilter(payMarketId, data.savedFilters);
        }
        if (!!currentDefault) {
          const metaInfo = this.savedFilterHelper.removePaymarketFromDefaultPayMarkets(payMarketId, currentDefault);
          actions.push(new fromSaveFilterModalActions.SetUpsertRequest(upsertRequest));
          actions.push(new fromSaveFilterModalActions.UpdateMetaInfo(
            { savedFilter: currentDefault, metaInfo: metaInfo }));
        } else {
          actions.push(new fromUserFilterActions.Upsert(upsertRequest));
        }
        return actions;
      })
    );

  @Effect()
  updateMetaInfoSuccess$ = this.actions$
  .pipe(
    ofType(fromSaveFilterModalActions.UPDATE_META_INFO_SUCCESS),
    withLatestFrom(
      this.store.select(fromUserFilterReducer.getUpsertRequest),
      (action: fromSaveFilterModalActions.UpdateMetaInfoSuccess, upsertRequest) =>
        ({ action, upsertRequest })),
    mergeMap(data => {
      return [ new fromUserFilterActions.Upsert(data.upsertRequest) ];
    })
  );

  @Effect()
  applyDefaultSavedFilter$ = this.actions$
    .pipe(
      ofType(fromUserFilterActions.APPLY_DEFAULT),
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        this.store.select(fromUserFilterReducer.getSavedFilters),
        (action: fromUserFilterActions.ApplyDefault, jobContext, pricingMatchDataSearchContext, savedFilters) =>
          ({ action, jobContext, pricingMatchDataSearchContext, savedFilters })),
      mergeMap(data => {
        const actions = [];
        const payMarketId = data.pricingMatchDataSearchContext.PaymarketId;
        const defaultFilterForThisPayMarket = this.savedFilterHelper.getDefaultFilter(payMarketId, data.savedFilters);
        const defaultFilterId = defaultFilterForThisPayMarket ? defaultFilterForThisPayMarket.Id : '';
        actions.push(new fromUserFilterActions.SetDefault(defaultFilterId));

        if (defaultFilterForThisPayMarket) {
          actions.push(new fromUserFilterPopoverActions.Select(defaultFilterForThisPayMarket));
        } else {
          actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: false }));
        }
        return actions;
      })
    );

  @Effect()
  editSavedFilter$ = this.actions$
    .pipe(
      ofType(fromUserFilterPopoverActions.EDIT),
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getPricingMatchDataSearchContext),
        (action: fromUserFilterPopoverActions.Edit, jobContext, pricingMatchDataSearchContext) =>
          ({ action, jobContext, pricingMatchDataSearchContext })),
      mergeMap(data => {
        const actions = [];
        const payMarketId = data.pricingMatchDataSearchContext.PaymarketId;
        const isPayMarketDefault = this.savedFilterHelper.isPayMarketDefaultFilter(data.action.payload, payMarketId);

        actions.push(new fromSaveFilterModalActions.SetModalData({
          Name: data.action.payload.Name,
          SetAsDefault: isPayMarketDefault,
          SearchFiltersToSave: data.action.payload.Filters,
          SavedFilter: data.action.payload
        }));
        actions.push(new fromSaveFilterModalActions.OpenSaveModal());

        return actions;
      })
    );

  constructor(
    private actions$: Actions,
    private userFilterApiService: UserFilterApiService,
    private payfactorsSearchApiModelMapper: PayfactorsSearchApiModelMapper,
    private store: Store<fromSurveySearchReducer.State>,
    private userFilterTypeData: UserFilterTypeData,
    private savedFilterHelper: SavedFilterHelper
  ) { }
}
