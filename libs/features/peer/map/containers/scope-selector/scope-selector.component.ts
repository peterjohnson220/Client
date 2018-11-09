import { Component, ViewChild, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/internal/operators';

import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';
import * as fromLibsFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsExchangeScopeActions from 'libs/features/peer/map/actions/exchange-scope.actions';
import { ExchangeScopeItem } from 'libs/models/peer/exchange-scope';

@Component({
  selector: 'pf-scope-selector',
  templateUrl: './scope-selector.component.html',
  styleUrls: ['./scope-selector.component.scss'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ScopeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('p') popover: NgbPopover;

  @Input() addDataModal: boolean;
  @Input() exchangeId: number;

  systemFilterLoaded$: Observable<boolean>;
  exchangeScopeItemsLoading$: Observable<boolean>;
  exchangeScopeItems$: Observable<ExchangeScopeItem[]>;
  selectedExchangeScopeItem$: Observable<ExchangeScopeItem>;
  systemFilterLoadedSubscription: Subscription;

  constructor(
    private store: Store<fromLibsPeerMapReducer.State>
  ) {
    this.exchangeScopeItems$ = this.store.pipe(select(fromLibsPeerMapReducer.getExchangeScopes));
    this.exchangeScopeItemsLoading$ = this.store.pipe(select(fromLibsPeerMapReducer.getExchangeScopesLoadingByJobs));
    this.systemFilterLoaded$ = this.store.pipe(select(fromLibsPeerMapReducer.getSystemFilterLoaded));
    this.selectedExchangeScopeItem$ = this.store.pipe(select(fromLibsPeerMapReducer.getPeerFilterScopeSelection));
  }

  handleExchangeScopeClicked(exchangeScopeItem: ExchangeScopeItem) {
      this.popover.close();
      this.store.dispatch(new fromLibsFilterSidebarActions.SetExchangeScopeSelection(exchangeScopeItem));
      this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopeDetails);
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

  // Lifecycle
  ngOnInit() {
    this.systemFilterLoadedSubscription = this.systemFilterLoaded$.subscribe(loaded => {
      if (loaded) {
        if (this.addDataModal) {
          this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByJobs);
        } else {
          this.store.dispatch(new fromLibsExchangeScopeActions.LoadExchangeScopesByExchange(this.exchangeId));
        }
      }
    });
  }

  ngOnDestroy() {
    this.systemFilterLoadedSubscription.unsubscribe();
  }
}
