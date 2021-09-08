import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { SettingsService } from 'libs/state/app-context/services';
import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';
import { ScrollIdConstants } from 'libs/features/search/infinite-scroll/models';

import * as fromLibsExchangeExplorerReducers from '../../reducers';
import * as fromLibsExchangeFilterContextActions from '../../actions/exchange-filter-context.actions';
import * as fromLibsExchangeScopeActions from '../../actions/exchange-scope.actions';

@Component({
  selector: 'pf-exchange-scope-selector',
  templateUrl: './exchange-scope-selector.component.html',
  styleUrls: ['./exchange-scope-selector.component.scss'],
  preserveWhitespaces: true
})

export class ExchangeScopeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('p') popover: NgbPopover;

  @Input() isExchangeJobSpecific: boolean;
  @Input() exchangeId: number;

  systemFilterLoaded$: Observable<boolean>;
  exchangeScopeItemsLoading$: Observable<boolean>;
  deletingExchangeScope$: Observable<boolean>;
  exchangeScopeItems$: Observable<ExchangeScopeItem[]>;
  selectedExchangeScopeItem$: Observable<ExchangeScopeItem>;
  inDeleteScopeMode$: Observable<boolean>;
  defaultExchangeScopeId$: Observable<number>;

  inDeleteModeSubscription: Subscription;
  scopeToDeleteSubscription: Subscription;
  systemFilterLoadedSubscription: Subscription;
  exchangeScopeItemsSubscription: Subscription;
  selectedExchangeScopeItemSubscription: Subscription;
  defaultExchangeScopeIdSubscription: Subscription;

  deleteMode = false;
  scopeToDelete$: Observable<ExchangeScopeItem>;
  scopeToDelete: ExchangeScopeItem = null;
  exchangeScopeItems: ExchangeScopeItem[];
  selectedExchangeScopeItem: ExchangeScopeItem;
  scopeFilter: string;
  defaultScopeToggled = false;
  scrollId: string;
  defaultExchangeScopeId: number;
  isInitialLoad = true;

  constructor(
    private store: Store<fromLibsExchangeExplorerReducers.State>,
    private settingsService: SettingsService
  ) {
    this.exchangeScopeItemsLoading$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopesLoadingByJobs));
    this.systemFilterLoaded$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getHasAppliedFilterContext));
    this.selectedExchangeScopeItem$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getSelectedExchangeScope));
    this.deletingExchangeScope$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getDeletingExchangeScope));
    this.inDeleteScopeMode$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getInDeleteExchangeScopeMode));
    this.scopeToDelete$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopeToDelete));
    this.scrollId = ScrollIdConstants.EXCHANGE_SCOPES;
  }

  handleExchangeScopeClicked(buttonClickEvent: any, exchangeScopeItem: ExchangeScopeItem) {
    if (!this.deleteMode) {
      this.popover.close();
      this.store.dispatch(new fromLibsExchangeFilterContextActions.SetExchangeScopeSelection(exchangeScopeItem));
      this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopeDetails);
    } else {
      buttonClickEvent.stopPropagation();
    }
  }

  handleDefaultClicked(scope: ExchangeScopeItem, buttonClickEvent$: any): void {
    buttonClickEvent$.stopPropagation();
    this.defaultScopeToggled = true;
    this.settingsService.updateUiPersistenceSettingDictionary(
      FeatureAreaConstants.PeerManageScopes,
      UiPersistenceSettingConstants.PeerDefaultExchangeScopes,
      this.exchangeId,
      !scope.IsDefault ? scope.ExchangeScopeId : null
      );
  }

  itemSelected(exchangeScopeItem: ExchangeScopeItem) {
    let isSelected = false;
    this.selectedExchangeScopeItem$.pipe(take(1)).subscribe(selection => {
      if (!!selection) {
        isSelected = selection.ExchangeScopeId === exchangeScopeItem.ExchangeScopeId;
      }
    });
    return isSelected;
  }

  highlightScope(exchangeScopeItem: ExchangeScopeItem) {
    let highlight = false;
    if (!!this.scopeToDelete) {
      highlight = this.scopeToDelete.ExchangeScopeId === exchangeScopeItem.ExchangeScopeId;
    }
    return highlight;
  }

  enterDeleteScopeMode(buttonClickEvent: any, exchangeScopeItem: ExchangeScopeItem): void {
    buttonClickEvent.stopPropagation();
    this.store.dispatch(new fromLibsExchangeScopeActions.SetExchangeScopeToDelete(exchangeScopeItem));
    this.store.dispatch(new fromLibsExchangeScopeActions.EnterDeleteExchangeScopeMode);
  }

  cancelDeleteScope(buttonClickEvent: any): void {
    buttonClickEvent.stopPropagation();
    this.store.dispatch(new fromLibsExchangeScopeActions.ExitDeleteExchangeScopeMode);
    this.store.dispatch(new fromLibsExchangeScopeActions.SetExchangeScopeToDelete(null));
  }

  deleteScope(buttonClickEvent: any): void {
    buttonClickEvent.stopPropagation();
    this.store.dispatch(new fromLibsExchangeScopeActions.DeleteExchangeScope({
      scopeId: this.scopeToDelete.ExchangeScopeId,
      isStandardScope: this.scopeToDelete.IsStandardScope
    }));
    this.store.dispatch(new fromLibsExchangeFilterContextActions.ClearExchangeScopeSelection());
  }

  handleSearchValueChanged(value: string) {
    this.scopeFilter = value.toLowerCase();

    this.store.dispatch(new fromLibsExchangeScopeActions.SetExchangeScopes([]));

    this.store.dispatch(new fromLibsExchangeScopeActions.SetExchangeScopeNameFilter(this.scopeFilter));
    this.loadExchangeScopes();
  }

  handlePopoverShown() {
    this.scopeFilter = '';
  }

  trackByFn(scopeItem: ExchangeScopeItem) {
    return scopeItem.ExchangeScopeId;
  }

  // Lifecycle
  ngOnInit() {

    const defaultExchangeScopeId$ = this.settingsService.selectUiPersistenceSettingFromDictionary<number>(
      FeatureAreaConstants.PeerManageScopes, UiPersistenceSettingConstants.PeerDefaultExchangeScopes, this.exchangeId
    );
    const exchangeScopeItems$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopes));
    const selectedExchangeScopeItem$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getSelectedExchangeScope));

    this.defaultExchangeScopeId$ = defaultExchangeScopeId$;

    this.exchangeScopeItems$ = combineLatest([exchangeScopeItems$, defaultExchangeScopeId$]).pipe(
      map(([exchangeScopeItems, defaultExchangeScopeId]) => {
        return exchangeScopeItems.map(esi => {
          const esiCopy = {...esi};
          esiCopy.IsDefault = esi.ExchangeScopeId === defaultExchangeScopeId;
          return esiCopy;
        });
      }));
    this.selectedExchangeScopeItem$ = combineLatest([selectedExchangeScopeItem$, defaultExchangeScopeId$])
      .pipe(map(([selectedItem, defaultId]) => {
        if (!!selectedItem) {
          return  {...selectedItem, IsDefault: selectedItem.ExchangeScopeId === defaultId};
        }

        return null;
      }));

    this.systemFilterLoadedSubscription = this.systemFilterLoaded$.subscribe(loaded => {
      if (loaded) {
        this.loadExchangeScopes();
      }
    });
    this.inDeleteModeSubscription = this.inDeleteScopeMode$.subscribe(dsm => this.deleteMode = dsm);
    this.scopeToDeleteSubscription = this.scopeToDelete$.subscribe(std => this.scopeToDelete = std);

    this.exchangeScopeItemsSubscription = this.exchangeScopeItems$.subscribe(esi => {
      this.exchangeScopeItems = esi;

      if (this.exchangeScopeItems.length > 0 && this.isInitialLoad) {
        this.isInitialLoad = false;
        const firstScope = this.exchangeScopeItems[0];
        if (firstScope.ExchangeScopeId === this.defaultExchangeScopeId) {
          this.store.dispatch(new fromLibsExchangeFilterContextActions.SetExchangeScopeSelection(firstScope));
        }
      }
    });

    this.defaultExchangeScopeIdSubscription = this.defaultExchangeScopeId$.subscribe(desi => {
      this.defaultExchangeScopeId = desi;
    });

    this.selectedExchangeScopeItemSubscription = this.selectedExchangeScopeItem$.subscribe(sesi => {
      this.selectedExchangeScopeItem = sesi;
    });
  }

  ngOnDestroy() {
    this.systemFilterLoadedSubscription.unsubscribe();
    this.inDeleteModeSubscription.unsubscribe();
    this.scopeToDeleteSubscription.unsubscribe();
    this.exchangeScopeItemsSubscription.unsubscribe();
    this.selectedExchangeScopeItemSubscription.unsubscribe();
    this.scopeFilter = '';
  }

  get numberOfCurrentResults(): number {
    return this.exchangeScopeItems?.length ?? 0;
  }

  loadExchangeScopes() {
    if (this.isExchangeJobSpecific) {
      this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByJobs);
    } else {
      this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByExchange());
    }
  }
}
