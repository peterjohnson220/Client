import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { ComphubType, SystemUserGroupNames } from 'libs/constants';
import { WindowRef } from 'libs/core';
import { UserContext } from 'libs/models/security';
import { AsyncStateObj } from 'libs/models/state';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import { AppConstants } from 'libs/constants';
import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import * as fromRootReducer from 'libs/state/state';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';

import { FooterContext, JobPricingLimitInfo, QuickPriceHistoryContext, WorkflowContext } from '../../models';
import { ComphubPages } from '../../data';
import * as fromComphubMainReducer from '../../reducers';
import * as fromSummaryCardActions from '../../actions/summary-card.actions';
import * as fromComphubPageActions from '../../actions/comphub-page.actions';
import * as fromTrendsSummaryCardActions from '../../actions/trends-summary-card.actions';

@Component({
  selector: 'pf-comphub-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class ComphubFooterComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;
  @Input() showJobHistorySummary: boolean;

  workflowContext$: Observable<WorkflowContext>;
  footerContext$: Observable<FooterContext>;
  jobPricingBlocked$: Observable<boolean>;
  pricedJobsCount$: Observable<AsyncStateObj<number>>;
  loadingMap$: Observable<boolean>;
  smbLimitReached$: Observable<boolean>;

  countryDataSetsLoaded$: Observable<boolean>;
  jobPricingLimitInfo$: Observable<JobPricingLimitInfo>;
  userContext$: Observable<UserContext>;
  selectedPageIdDelayed$: Observable<string>;

  workflowContextSub: Subscription;
  jobPricingLimitInfoSub: Subscription;
  loadingPeerMapSub: Subscription;
  footerContextSub: Subscription;

  comphubPages = ComphubPages;
  workflowContext: WorkflowContext;
  isPeerComphubType = false;
  systemUserGroupNames = SystemUserGroupNames;
  jobPricingLimitInfo: JobPricingLimitInfo;
  loadingPeerMap: boolean;
  footerContext: FooterContext;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>,
    public guidelinesService: DojGuidelinesService,
    private window: WindowRef
  ) {
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.jobPricingBlocked$ = this.store.select(fromComphubMainReducer.getJobPricingBlocked);
    this.footerContext$ = this.store.select(fromComphubMainReducer.getFooterContext);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.countryDataSetsLoaded$ = this.store.select(fromComphubMainReducer.getCountryDataSetsLoaded);
    this.jobPricingLimitInfo$ = this.store.select(fromComphubMainReducer.getJobPricingLimitInfo);
    this.selectedPageIdDelayed$ = this.store.select(fromComphubMainReducer.getSelectedPageId).pipe(debounceTime(750));
    this.loadingMap$ = this.exchangeExplorerStore.select(fromLibsPeerExchangeExplorerReducers.getPeerMapLoading);
    this.pricedJobsCount$ = this.basicGridStore.select(fromBasicDataGridReducer.getTotalCount, QuickPriceHistoryContext.gridId);
    this.smbLimitReached$ = this.store.select(fromComphubMainReducer.getSmbLimitReached);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromComphubPageActions.UpdateFooterContext());

    this.workflowContextSub = this.workflowContext$.subscribe(wfc => {
      this.workflowContext = wfc;
      this.isPeerComphubType = wfc.comphubType === ComphubType.PEER;
    });

    combineLatest([this.jobPricingBlocked$, this.workflowContext$]).pipe(
      map(([jobPricedBlocked, workflowContext]) => {
        return {
          jobPricedBlocked,
          workflowContext
        };
      })).subscribe(data => {
      if (data.jobPricedBlocked && data.workflowContext) {
        this.store.dispatch(new fromComphubPageActions.UpdateFooterContext());
      }
    });
    this.jobPricingLimitInfoSub = this.jobPricingLimitInfo$.subscribe(jpli => this.jobPricingLimitInfo = jpli);
    this.loadingPeerMapSub = this.loadingMap$.subscribe(x => this.loadingPeerMap = x);
    this.footerContextSub = this.footerContext$.subscribe(fc => this.footerContext = fc);
  }

  ngOnDestroy(): void {
    this.workflowContextSub.unsubscribe();
    this.jobPricingLimitInfoSub.unsubscribe();
    this.loadingPeerMapSub.unsubscribe();
    this.footerContextSub.unsubscribe();
  }

  handleNextButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToNextCard());
  }

  handleBackButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToPreviousCard());
  }

  handlePriceNewJobClicked() {
    if (this.isPeerComphubType) {
      this.store.dispatch(new fromSummaryCardActions.PriceNewPeerJob());
    } else {
      this.store.dispatch(new fromSummaryCardActions.PriceNewJob());
    }
  }

  openQuickPriceHistoryModal(): void {
    this.store.dispatch(new fromComphubPageActions.SetQuickPriceHistoryModalOpen(true));
  }

  handleConfirmedCloseApp() {
    let returnLocation = `/${AppConstants.HostPath}/dashboard`;

    if (this.workflowContext.comphubType === ComphubType.PEER) {
      returnLocation = `/${AppConstants.HostPath}/peer/exchanges/redirect`;
    }

    this.window.nativeWindow.location = returnLocation;
  }

  get formattedLimit() {
    return `${this.jobPricingLimitInfo.Used} of ${this.jobPricingLimitInfo.Available}`;
  }

  get failsGuidelines(): boolean {
    return !this.guidelinesService.passesGuidelines;
  }

  get nextButtonDisabled() {
    if (this.isPeerComphubType && this.workflowContext.selectedPageId === ComphubPages.Data) {
      return this.failsGuidelines || this.loadingPeerMap;
    } else {
      return !this.footerContext?.NextButtonEnabled;
    }
  }

  handleSaveButtonClicked() {
    this.store.dispatch(new fromTrendsSummaryCardActions.ToggleSaveTrendModal({displayModal: true}));
  }
}
