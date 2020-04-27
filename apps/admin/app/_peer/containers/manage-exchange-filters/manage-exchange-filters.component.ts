import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as cloneDeep from 'lodash.clonedeep';

import { Exchange, ExchangeSearchFilterAggregate } from 'libs/models/peer';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';

import { GridHelperService } from '../../services';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeFiltersActions from '../../actions/exchange-filters.actions';
import * as fromTagCategoriesActions from '../../actions/tag-categories.actions';

@Component({
  selector: 'pf-manage-exchange-filters',
  templateUrl: './manage-exchange-filters.component.html',
  styleUrls: ['./manage-exchange-filters.component.scss']
})

export class ManageExchangeFiltersComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  exchangeFiltersLoading$: Observable<boolean>;
  exchangeFiltersLoadingError$: Observable<boolean>;
  exchangeFilterPutting$: Observable<boolean>;
  exchangeFilterPuttingError$: Observable<boolean>;
  exchangeFilters$: Observable<ExchangeSearchFilterAggregate[]>;


  exchangeId: number;
  searchString = '';
  exchangeFilters: ExchangeSearchFilterAggregate[];

  filtersSubscription: Subscription;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute,
    private gridHelperService: GridHelperService,
    private uiPersistenceSettingsApiService: UiPersistenceSettingsApiService
  ) {
    this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));
    this.exchangeFiltersLoading$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeFiltersLoading));
    this.exchangeFiltersLoadingError$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeFiltersLoadingError));
    this.exchangeFilters$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeFilters));
    this.exchangeFilterPutting$ = this.store.pipe(select(fromPeerAdminReducer.getPuttingExchangeFilter));
    this.exchangeFilterPuttingError$ = this.store.pipe(select(fromPeerAdminReducer.getPuttingExchangeFilterError));

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  get searching() {
    return this.searchString !== '';
  }

  // Events
  handleExchangeFiltersGridReload() {
    this.store.dispatch(new fromExchangeFiltersActions.LoadExchangeFilters({
      exchangeId: this.exchangeId,
      searchString: ''
    }));
  }

  handleSwitchToggled(exchangeFilter: ExchangeSearchFilterAggregate) {
    const updatedExchangeFilter = {...exchangeFilter};
    updatedExchangeFilter.IsDisabled = !updatedExchangeFilter.IsDisabled;
    this.store.dispatch(new fromExchangeFiltersActions.PutFilter(updatedExchangeFilter));
  }

  handleCollapsedSwitchToggled(exchangeFilter: ExchangeSearchFilterAggregate) {
    const updatedExchangeFilter = {...exchangeFilter};
    updatedExchangeFilter.IsCollapsedByDefault = !updatedExchangeFilter.IsCollapsedByDefault;
    this.store.dispatch(new fromExchangeFiltersActions.PutFilter(updatedExchangeFilter));
  }

  handleSearchChanged(query: string): void {
    this.searchString = query;
    this.gridHelperService.loadExchangeFilters(this.exchangeId, query);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.exchangeFilters, event.previousIndex, event.currentIndex);
    this.store.dispatch(new fromExchangeFiltersActions.ReorderFilters(this.exchangeFilters));
  }

  openAddTagCategoriesModal() {
    this.store.dispatch(new fromTagCategoriesActions.OpenAddTagCategoriesModal());
  }

  handleSaveFilterDisplayName(newDisplayName: string, id: number): void {
    const currentExchangeFilterObj = {...this.exchangeFilters.find(ef => ef.Id === id)};
    if (currentExchangeFilterObj) {
      currentExchangeFilterObj.DisplayName = newDisplayName;
      this.store.dispatch(new fromExchangeFiltersActions.PutFilter(currentExchangeFilterObj));
    }
  }

  ngOnInit(): void {
    this.filtersSubscription = this.exchangeFilters$.subscribe(ef => this.exchangeFilters = cloneDeep(ef));
  }

  ngOnDestroy(): void {
    this.filtersSubscription.unsubscribe();
  }
}
