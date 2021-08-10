import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { ExchangeJobSearchOption } from 'libs/models/peer/ExchangeJobSearchOption';
import { KendoDropDownItem } from 'libs/models/kendo';
import { WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import { ExchangeDataSet } from 'libs/models/comphub';
import * as fromLibsExchangeExplorerFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import * as fromExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';

import * as fromDataCardActions from '../../../../_shared/actions/data-card.actions';
import * as fromComphubSharedReducers from '../../../../_shared/reducers';
import { WorkflowContext } from '../../../../_shared/models';
import { ComphubPages } from '../../../../_shared/data';

import * as fromPeerTrendsDataReducers from '../../../reducers';

@Component({
  selector: 'pf-trends-scopes-card',
  templateUrl: './trends-scopes.card.component.html',
  styleUrls: ['./trends-scopes.card.component.scss']
})
export class TrendsScopesCardComponent implements OnInit, OnDestroy {
  @ViewChild(ExchangeExplorerComponent) exchangeExplorer: ExchangeExplorerComponent;

  selectedWeightingType: KendoDropDownItem = {Name: WeightTypeDisplayLabeled.Org, Value: WeightType.Org};
  untaggedIncumbentCount$: Observable<number>;
  includeUntaggedIncumbents$: Observable<boolean>;
  selectedPageIdDelayed$: Observable<string>;
  workflowContext$: Observable<WorkflowContext>;
  forceRefresh$: Observable<boolean>;
  selectedExchange$: Observable<ExchangeDataSet>;
  mapFilter$: Observable<any>;
  selectedJobTitle$: Observable<string>;

  selectedExchangeJobs$: Observable<ExchangeJobSearchOption[]>;
  selectedExchangeJobsSubscription: Subscription;
  selectedExchangeJobs: ExchangeJobSearchOption[];

  untaggedIncumbentCountSubscription: Subscription;
  selectedPageIdDelayedSubscription: Subscription;
  workflowContextSubscription: Subscription;
  forceRefreshSubscription: Subscription;
  selectedExchangeSubscription: Subscription;
  selectedExchangeJobIdSubscription: Subscription;
  mapFilterSubscription: Subscription;

  selectedPageIdDelayed: string;
  untaggedIncumbentCount: number;
  workflowContext: WorkflowContext;
  forceRefresh: boolean;
  selectedExchangeId: number;
  mapFilter: any;
  mapExchangeId: number;
  mapExchangeJobs: ExchangeJobSearchOption[];

  displayMap = false;
  comphubPages = ComphubPages;

  constructor(private store: Store<fromComphubSharedReducers.State>,
              private changeDetectorRef: ChangeDetectorRef,
              private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>) {

    this.untaggedIncumbentCount$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getPeerMapUntaggedIncumbentCount));
    this.includeUntaggedIncumbents$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getFilterContextIncludeUntaggedIncumbents));
    this.selectedPageIdDelayed$ = this.store.select(fromComphubSharedReducers.getSelectedPageId).pipe(debounceTime(750));
    this.workflowContext$ = this.store.select(fromComphubSharedReducers.getWorkflowContext);
    this.forceRefresh$ = this.store.select(fromComphubSharedReducers.getForcePeerMapRefresh);
    this.selectedExchange$ = this.store.select(fromComphubSharedReducers.getActiveExchangeDataSet);
    this.mapFilter$ = this.exchangeExplorerStore.select(fromLibsPeerExchangeExplorerReducers.getPeerMapFilter);
    this.selectedJobTitle$ = this.store.select(fromComphubSharedReducers.getSelectedJob);
    this.selectedExchangeJobs$ = this.store.select(fromPeerTrendsDataReducers.getSelectedExchangeJobs);
  }

  ngOnInit() {
    this.untaggedIncumbentCountSubscription = this.untaggedIncumbentCount$.subscribe(uic => this.untaggedIncumbentCount = uic);
    this.selectedPageIdDelayedSubscription = this.selectedPageIdDelayed$.subscribe(id => {
      this.selectedPageIdDelayed = id;
      this.onSelectedPageIdDelayedChanges(this.workflowContext);
    });
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      this.workflowContext = wfc;
    });
    this.forceRefreshSubscription = this.forceRefresh$.subscribe(r => this.forceRefresh = r);
    this.selectedExchangeSubscription = this.selectedExchange$.subscribe(e => {
      if (!!e) {
        this.selectedExchangeId = e.ExchangeId;
      }
    });
    this.mapFilterSubscription = this.mapFilter$.subscribe(f => this.mapFilter = f);
    this.selectedExchangeJobsSubscription = this.selectedExchangeJobs$.subscribe(x => this.selectedExchangeJobs = x);
  }

  ngOnDestroy() {
    this.untaggedIncumbentCountSubscription.unsubscribe();
    this.selectedPageIdDelayedSubscription.unsubscribe();
    this.workflowContextSubscription.unsubscribe();
    this.forceRefreshSubscription.unsubscribe();
    this.selectedExchangeSubscription.unsubscribe();
    this.mapFilterSubscription.unsubscribe();
    this.selectedExchangeJobsSubscription.unsubscribe();
  }

  showMap() {
    this.displayMap = true;
    this.changeDetectorRef.detectChanges();
  }

  handleWeightingTypeChanged(item: KendoDropDownItem) {
    this.selectedWeightingType = item;
    this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions.SetWeightingType({weightingType: item.Value}));
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


  onSelectedPageIdDelayedChanges(workflowContext: WorkflowContext): void {
    if (workflowContext.selectedPageId === ComphubPages.TrendsScopes) {
      this.showMap();
      this.store.dispatch(new fromDataCardActions.CardOpened());
      if (!!this.exchangeExplorer && !(this.validateMapData())) {
        const setContextMessage: MessageEvent = {
          data: {
            payfactorsMessage: {
              type: 'Set Context',
              payload: {
                exchangeId: this.selectedExchangeId,
                exchangeJobIds: this.selectedExchangeJobs.map(x => x.ExchangeJobId),
                isExchangeSpecific: true,
                companyPayMarketId: null
              }
            }
          }
        } as MessageEvent;
        this.exchangeExplorer.onMessage(setContextMessage);
        this.refreshMapData();
      }
    } else if (this.displayMap && this.selectedPageIdDelayed !== ComphubPages.TrendsScopes) {
      this.store.dispatch(new fromExchangeExplorerMapActions.SetPeerMapBounds({
        TopLeft: this.mapFilter.TopLeft,
        BottomRight: this.mapFilter.BottomRight,
        Centroid: null
      }));
      this.displayMap = false;
    }
  }


  validateMapData() {
    if (this.forceRefresh) {
      this.store.dispatch(new fromDataCardActions.SetForceRefreshPeerMap(false));
      return false;
    }
    if ((!this.mapExchangeJobs)) {
      return false;
    }

    return this.mapExchangeId === this.selectedExchangeId && this.mapExchangeJobs === this.selectedExchangeJobs;
  }
  refreshMapData() {
    this.mapExchangeId = this.selectedExchangeId;
    this.mapExchangeJobs = this.selectedExchangeJobs;
  }
}
