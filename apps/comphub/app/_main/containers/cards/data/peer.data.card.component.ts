import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';

import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { KendoDropDownItem } from 'libs/models/kendo';
import { WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsExchangeExplorerFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import * as fromExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';

import { ExchangeDataSet, PricingPaymarket, WorkflowContext } from '../../../models';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-peer-data-card',
  templateUrl: './peer.data.card.component.html',
  styleUrls: ['./peer.data.card.component.scss',
    './shared.data.card.component.scss']
})
export class PeerDataCardComponent implements OnInit, OnDestroy {
  @ViewChild(ExchangeExplorerComponent) exchangeExplorer: ExchangeExplorerComponent;

  displayMap = false;
  jobTitle: string;
  comphubPages = ComphubPages;

  // Observables
  selectedJobTitle$: Observable<string>;
  selectedPayMarket$: Observable<PricingPaymarket>;
  selectedExchange$: Observable<ExchangeDataSet>;
  selectedExchangeJobId$: Observable<number>;
  selectedPageId$: Observable<string>;
  selectedPageIdDelayed$: Observable<string>;
  includeUntaggedIncumbents$: Observable<boolean>;
  untaggedIncumbentCount$: Observable<number>;
  workflowContext$: Observable<WorkflowContext>;
  forceRefresh$: Observable<boolean>;
  mapFilter$: Observable<any>;

  // Subscriptions
  payMarketSubscription: Subscription;
  selectedPageIdSubscription: Subscription;
  selectedPageIdDelayedSubscription: Subscription;
  selectedExchangeSubscription: Subscription;
  selectedExchangeJobIdSubscription: Subscription;
  untaggedIncumbentCountSubscription: Subscription;
  selectedJobTitleSubscription: Subscription;
  workflowContextSubscription: Subscription;
  forceRefreshSubscription: Subscription;
  mapFilterSubscription: Subscription;

  forceRefresh: boolean;
  selectedExchangeId: number;
  selectedPayMarketId: number;
  selectedJobTitle: string;
  selectedExchangeJobId: number;

  mapExchangeId: number;
  mapPayMarketId: number;
  mapJobTitle: string;
  selectedPageId: string;
  selectedPageIdDelayed: string;
  selectedWeightingType: KendoDropDownItem = {Name: WeightTypeDisplayLabeled.Org, Value: WeightType.Org};
  untaggedIncumbentCount: number;
  workflowContext: WorkflowContext;
  mapFilter: any;
  pageLoading: boolean;

  constructor(private store: Store<fromComphubMainReducer.State>,
              private changeDetectorRef: ChangeDetectorRef,
              private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>) {
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPayMarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedExchange$ = this.store.select(fromComphubMainReducer.getActiveExchangeDataSet);
    this.selectedExchangeJobId$ = this.store.select(fromComphubMainReducer.getSelectedExchangeJobId);
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
    this.includeUntaggedIncumbents$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getFilterContextIncludeUntaggedIncumbents));
    this.untaggedIncumbentCount$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getPeerMapUntaggedIncumbentCount));
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.forceRefresh$ = this.store.select(fromComphubMainReducer.getForcePeerMapRefresh);
    this.selectedPageIdDelayed$ = this.store.select(fromComphubMainReducer.getSelectedPageId).pipe(debounceTime(750));
    this.mapFilter$ = this.exchangeExplorerStore.select(fromLibsPeerExchangeExplorerReducers.getPeerMapFilter);
  }

  showMap() {
    this.displayMap = true;
    this.changeDetectorRef.detectChanges();
  }

  handleWeightingTypeChanged(item: KendoDropDownItem) {
    this.selectedWeightingType = item;
    this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions.SetWeightingType({weightingType: item.Value}));
  }

  ngOnInit(): void {
    this.selectedExchangeSubscription = this.selectedExchange$.subscribe(e => {
        if (!!e) {
          this.selectedExchangeId = e.ExchangeId;
        }
      }
    );

    this.payMarketSubscription = this.selectedPayMarket$.subscribe(pm => {
      if (!!pm) {
        this.selectedPayMarketId = pm.CompanyPayMarketId;
      }
    });

    this.selectedExchangeJobIdSubscription = this.selectedExchangeJobId$.subscribe(id => this.selectedExchangeJobId = id);
    this.selectedPageIdSubscription = this.selectedPageId$.subscribe(id => this.selectedPageId = id);
    this.untaggedIncumbentCountSubscription = this.untaggedIncumbentCount$.subscribe(uic => this.untaggedIncumbentCount = uic);
    this.selectedJobTitleSubscription = this.selectedJobTitle$.subscribe(jt => this.selectedJobTitle = jt);
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      this.workflowContext = wfc;
    });

    this.forceRefreshSubscription = this.forceRefresh$.subscribe(r => this.forceRefresh = r);

    this.selectedPageIdDelayedSubscription = this.selectedPageIdDelayed$.subscribe(id => {
      this.selectedPageIdDelayed = id;
      this.onSelectedPageIdDelayedChanges(this.workflowContext);
    });

    this.mapFilterSubscription = this.mapFilter$.subscribe(f => this.mapFilter = f);
  }

  onSelectedPageIdDelayedChanges(workflowContext: WorkflowContext): void {
    if (workflowContext.selectedPageId === ComphubPages.Data) {
      this.showMap();
      this.store.dispatch(new fromDataCardActions.CardOpened());
      if (!!this.exchangeExplorer && !(this.validateMapData())) {
        const setContextMessage: MessageEvent = {
          data: {
            payfactorsMessage: {
              type: 'Set Context',
              payload: {
                exchangeId: this.selectedExchangeId,
                exchangeJobId: this.selectedExchangeJobId,
                isExchangeSpecific: true,
                companyPayMarketId: this.selectedPayMarketId
              }
            }
          }
        } as MessageEvent;
        this.exchangeExplorer.onMessage(setContextMessage);
        this.refreshMapData();
      }
    } else
    if (this.displayMap && this.selectedPageIdDelayed !== ComphubPages.Data) {
      this.store.dispatch(new fromExchangeExplorerMapActions.SetPeerMapBounds({
          TopLeft: this.mapFilter.TopLeft,
          BottomRight: this.mapFilter.BottomRight,
          Centroid: null
      }));
      this.displayMap = false;
    }
  }

  ngOnDestroy(): void {
    this.selectedExchangeSubscription.unsubscribe();
    this.payMarketSubscription.unsubscribe();
    this.selectedExchangeJobIdSubscription.unsubscribe();
    this.selectedPageIdSubscription.unsubscribe();
    this.untaggedIncumbentCountSubscription.unsubscribe();
    this.selectedJobTitleSubscription.unsubscribe();
    this.workflowContextSubscription.unsubscribe();
    this.forceRefreshSubscription.unsubscribe();
    this.selectedPageIdDelayedSubscription.unsubscribe();
    this.mapFilterSubscription.unsubscribe();
  }

  get untaggedIncumbentMessage(): string {
    if (this.untaggedIncumbentCount === 1) {
      return `Include ${this.untaggedIncumbentCount} incumbent that does not have location data`;
    }
    return `Include ${this.untaggedIncumbentCount} incumbents that do not have location data`;
  }

  handleUntaggedIncumbentsChecked(): void {
    this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions.ToggleIncludeUntaggedEmployees);
  }

  validateMapData() {
    if (this.forceRefresh) {
      this.store.dispatch(new fromDataCardActions.SetForceRefreshPeerMap(false));
      return false;
    }

    if ((!this.mapExchangeId || !this.mapJobTitle)) {
      return false;
    }

    return this.mapExchangeId === this.selectedExchangeId
      && this.mapPayMarketId === this.selectedPayMarketId
      && this.mapJobTitle === this.selectedJobTitle;
  }

  refreshMapData() {
    this.mapJobTitle = this.selectedJobTitle;
    this.mapExchangeId = this.selectedExchangeId;
    this.mapPayMarketId = this.selectedPayMarketId;
  }
}
