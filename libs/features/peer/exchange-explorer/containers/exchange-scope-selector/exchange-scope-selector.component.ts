import { Component, ViewChild, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/internal/operators';

import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

import * as fromLibsExchangeExplorerReducers from '../../reducers';
import * as fromLibsExchangeFilterContextActions from '../../actions/exchange-filter-context.actions';
import * as fromLibsExchangeScopeActions from '../../actions/exchange-scope.actions';

@Component({
  selector: 'pf-exchange-scope-selector',
  templateUrl: './exchange-scope-selector.component.html',
  styleUrls: ['./exchange-scope-selector.component.scss'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExchangeScopeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('p', {static: false }) popover: NgbPopover;

  @Input() isExchangeJobSpecific: boolean;
  @Input() exchangeId: number;

  systemFilterLoaded$: Observable<boolean>;
  exchangeScopeItemsLoading$: Observable<boolean>;
  deletingExchangeScope$: Observable<boolean>;
  exchangeScopeItems$: Observable<ExchangeScopeItem[]>;
  selectedExchangeScopeItem$: Observable<ExchangeScopeItem>;
  systemFilterLoadedSubscription: Subscription;
  inDeleteScopeMode$: Observable<boolean>;
  inDeleteModeSubscription: Subscription;
  deleteMode = false;
  scopeToDelete$: Observable<ExchangeScopeItem>;
  scopeToDeleteSubscription: Subscription;
  scopeToDelete: ExchangeScopeItem = null;

  constructor(
    private store: Store<fromLibsExchangeExplorerReducers.State>
  ) {
    this.exchangeScopeItems$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopes));
    this.exchangeScopeItemsLoading$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopesLoadingByJobs));
    this.systemFilterLoaded$ = this.store.pipe(select(fromLibsExchangeExplorerReducers.getSystemFilterLoaded));
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
  }

  // Lifecycle
  ngOnInit() {
    this.systemFilterLoadedSubscription = this.systemFilterLoaded$.subscribe(loaded => {
      if (loaded) {
        if (this.isExchangeJobSpecific) {
          this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByJobs);
        } else {
          this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByExchange(this.exchangeId));
        }
      }
    });
    this.inDeleteModeSubscription = this.inDeleteScopeMode$.subscribe(dsm => {
      this.deleteMode = dsm;
    });
    this.scopeToDeleteSubscription = this.scopeToDelete$.subscribe(std => {
      this.scopeToDelete = std;
    });
  }

  ngOnDestroy() {
    this.systemFilterLoadedSubscription.unsubscribe();
    this.inDeleteModeSubscription.unsubscribe();
    this.scopeToDeleteSubscription.unsubscribe();
  }
}
