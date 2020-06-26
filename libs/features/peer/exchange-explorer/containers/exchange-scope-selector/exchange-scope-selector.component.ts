import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/internal/operators';

import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { SettingsService } from 'libs/state/app-context/services';
import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

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
  defaultExchangeScopeId$: Observable<string>;

  inDeleteModeSubscription: Subscription;
  scopeToDeleteSubscription: Subscription;
  systemFilterLoadedSubscription: Subscription;
  exchangeScopeItemsSubscription: Subscription;
  selectedExchangeScopeItemSubscription: Subscription;

  deleteMode = false;
  scopeToDelete$: Observable<ExchangeScopeItem>;
  scopeToDelete: ExchangeScopeItem = null;
  exchangeScopeItems: ExchangeScopeItem[];
  filteredExchangeScopeItems: ExchangeScopeItem[];
  selectedExchangeScopeItem: ExchangeScopeItem;
  scopeFilter: string;
  defaultScopeToggled = false;

  constructor(
    private store: Store<fromLibsExchangeExplorerReducers.State>,
    private settingsService: SettingsService
  ) {
    this.exchangeScopeItemsLoading$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopesLoadingByJobs));
    this.systemFilterLoaded$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getHasAppliedFilterContext));
    this.selectedExchangeScopeItem$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getFilterContextScopeSelection));
    this.deletingExchangeScope$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getDeletingExchangeScope));
    this.inDeleteScopeMode$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getInDeleteExchangeScopeMode));
    this.scopeToDelete$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopeToDelete));
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
      !scope.IsDefault ? scope.Id : null
      );
  }

  itemSelected(exchangeScopeItem: ExchangeScopeItem) {
    let isSelected = false;
    this.selectedExchangeScopeItem$.pipe(take(1)).subscribe(selection => {
      if (!!selection) {
        isSelected = selection.Id === exchangeScopeItem.Id;
      }
    });
    return isSelected;
  }

  highlightScope(exchangeScopeItem: ExchangeScopeItem) {
    let highlight = false;
    if (!!this.scopeToDelete) {
      highlight = this.scopeToDelete.Id === exchangeScopeItem.Id;
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
    this.store.dispatch(new fromLibsExchangeScopeActions.DeleteExchangeScope(this.scopeToDelete.Id));
    this.store.dispatch(new fromLibsExchangeFilterContextActions.ClearExchangeScopeSelection());
  }

  handleSearchValueChanged(value: string) {
    this.scopeFilter = value.toLowerCase();
    this.applyFilterToScopeList();
  }

  applyFilterToScopeList(): void {
    if (!!this.scopeFilter && !!this.scopeFilter.length) {
      this.filteredExchangeScopeItems = this.exchangeScopeItems.filter(esi => esi.Name.toLowerCase().includes(this.scopeFilter));
    } else {
      this.filteredExchangeScopeItems = this.exchangeScopeItems;
    }
  }

  handlePopoverShown() {
    this.scopeFilter = '';
    this.filteredExchangeScopeItems = this.exchangeScopeItems;
  }

  trackByFn(scopeItem: ExchangeScopeItem) {
    return scopeItem.Id;
  }

  // Lifecycle
  ngOnInit() {

    const defaultExchangeScopeId$ = this.settingsService.selectUiPersistenceSettingFromDictionary<string>(
      FeatureAreaConstants.PeerManageScopes, UiPersistenceSettingConstants.PeerDefaultExchangeScopes, this.exchangeId
    );
    const exchangeScopeItems$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopes));
    const selectedExchangeScopeItem$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getFilterContextScopeSelection));

    this.defaultExchangeScopeId$ = defaultExchangeScopeId$;

    this.exchangeScopeItems$ = combineLatest([exchangeScopeItems$, defaultExchangeScopeId$]).pipe(
      map(([exchangeScopeItems, defaultExchangeScopeId]) => {
        return exchangeScopeItems.map(esi => {
          const esiCopy = {...esi};
          esiCopy.IsDefault = esi.Id === defaultExchangeScopeId;
          return esiCopy;
        });
      }));
    this.selectedExchangeScopeItem$ = combineLatest([selectedExchangeScopeItem$, defaultExchangeScopeId$])
      .pipe(map(([selectedItem, defaultId]) => {
        if (!!selectedItem) {
          return  {...selectedItem, IsDefault: selectedItem.Id === defaultId};
        }

        return null;
      }));

    // Select the default exchange scope once the scopes have loaded
    combineLatest([selectedExchangeScopeItem$, this.exchangeScopeItems$, defaultExchangeScopeId$])
      .pipe(
        filter(([selected, items, defaultId]) => !!defaultId && !this.defaultScopeToggled),
        take(1)
      ).subscribe(([selected, items, defaultId]) => {
      if (!selected && !!items && items.length && !!defaultId) {
        const defaultExchangeScopeItem = items.find(i => i.Id === defaultId);
        if (!!defaultExchangeScopeItem) {
          const itemToSelect = {...defaultExchangeScopeItem, IsDefault: true};
          this.store.dispatch(new fromLibsExchangeFilterContextActions.SetExchangeScopeSelection(itemToSelect));
        }
      }
    });

    this.systemFilterLoadedSubscription = this.systemFilterLoaded$.subscribe(loaded => {
      if (loaded) {
        if (this.isExchangeJobSpecific) {
          this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByJobs);
        } else {
          this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByExchange(this.exchangeId));
        }
      }
    });
    this.inDeleteModeSubscription = this.inDeleteScopeMode$.subscribe(dsm => this.deleteMode = dsm);
    this.scopeToDeleteSubscription = this.scopeToDelete$.subscribe(std => this.scopeToDelete = std);
    this.exchangeScopeItemsSubscription = this.exchangeScopeItems$.subscribe(esi => {
      this.exchangeScopeItems = esi;
      this.applyFilterToScopeList();
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
}
