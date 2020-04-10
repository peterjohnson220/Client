import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { MapComponent } from 'libs/features/peer/map/containers/map';
import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { KendoDropDownItem } from 'libs/models/kendo';
import { WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsExchangeExplorerFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';

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
  @ViewChild(MapComponent, {static: true}) map: MapComponent;
  @ViewChild(ExchangeExplorerComponent, {static: false}) exchangeExplorer: ExchangeExplorerComponent;

  displayMap = false;
  jobTitle: string;
  comphubPages = ComphubPages;

  // Observables
  selectedJobTitle$: Observable<string>;
  selectedPayMarket$: Observable<PricingPaymarket>;
  selectedExchange$: Observable<ExchangeDataSet>;
  selectedExchangeJobId$: Observable<number>;
  selectedPageId$: Observable<string>;
  includeUntaggedIncumbents$: Observable<boolean>;
  untaggedIncumbentCount$: Observable<number>;
  workflowContext$: Observable<WorkflowContext>;

  // Subscriptions
  payMarketSubscription: Subscription;
  selectedPageIdSubscription: Subscription;
  selectedExchangeSubscription: Subscription;
  selectedExchangeJobIdSubscription: Subscription;
  untaggedIncumbentCountSubscription: Subscription;
  selectedJobTitleSubscription: Subscription;
  workflowContextSubscription: Subscription;

  selectedExchangeId: number;
  selectedPayMarketId: number;
  selectedJobTitle: string;
  selectedExchangeJobId: number;

  mapExchangeId: number;
  mapPayMarketId: number;
  mapJobTitle: string;
  selectedPageId: string;
  selectedWeightingType: KendoDropDownItem = {Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc};
  untaggedIncumbentCount: number;
  workflowContext: WorkflowContext;

  constructor(private store: Store<fromComphubMainReducer.State>,
              public guidelinesService: DojGuidelinesService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.selectedJobTitle$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPayMarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedExchange$ = this.store.select(fromComphubMainReducer.getActiveExchangeDataSet);
    this.selectedExchangeJobId$ = this.store.select(fromComphubMainReducer.getSelectedExchangeJobId);
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
    this.includeUntaggedIncumbents$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getFilterContextIncludeUntaggedIncumbents));
    this.untaggedIncumbentCount$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getPeerMapUntaggedIncumbentCount));
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
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
      this.onWorkflowContextChanges(wfc);
    });
  }

  onWorkflowContextChanges(workflowContext: WorkflowContext): void {
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

  get failsGuidelines(): boolean {
    return !this.guidelinesService.passesGuidelines;
  }
}
