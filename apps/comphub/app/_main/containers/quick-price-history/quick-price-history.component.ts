import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { BasicDataViewField } from 'libs/models/payfactors-api/reports/request';
import { AsyncStateObj } from 'libs/models/state';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { BasicGridSettings } from 'libs/features/grids/basic-data-grid/models';
import { JobPricedHistorySummaryRequest } from 'libs/models/payfactors-api/comphub/request';
import { QuickPriceType } from 'libs/constants';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';

import * as fromComphubPageActions from '../../actions/comphub-page.actions';
import * as fromQuickPriceHistoryActions from '../../actions/quick-price-history.actions';
import * as fromComphubMainReducer from '../../reducers';
import { QuickPriceHistoryContext, WorkflowContext } from '../../models';


@Component({
  selector: 'pf-quick-price-history',
  templateUrl: './quick-price-history.component.html',
  styleUrls: ['./quick-price-history.component.scss']
})
export class QuickPriceHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  data$: Observable<AsyncStateObj<any[]>>;
  fields$: Observable<BasicDataViewField[]>;
  loadingMoreData$: Observable<boolean>;
  hasMoreDataOnServer$: Observable<boolean>;
  isQuickPriceHistoryOpen$: Observable<boolean>;
  isQuickPriceHistoryNoteDismissed$: Observable<boolean>;
  workflowContext$: Observable<WorkflowContext>;
  loadingJobDataHistory$: Observable<boolean>;
  loadingJobDataErrorMessage$: Observable<string>;

  hasMoreDataOnServerSubscription: Subscription;
  isQuickPriceHistoryOpenSubscription: Subscription;
  workflowContextSub: Subscription;

  @ViewChild('base50Column') base50Column: ElementRef;
  hasMoreDataOnServer: boolean;
  isPeerQuickPriceType: boolean;
  gridId = QuickPriceHistoryContext.gridId;
  gridSettings: BasicGridSettings = {
    Sortable: true
  };

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private settingsService: SettingsService
  ) {
    this.data$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, QuickPriceHistoryContext.gridId);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.fields$ = this.basicGridStore.select(fromBasicDataGridReducer.getVisibleFields, QuickPriceHistoryContext.gridId);
    this.loadingMoreData$ = this.basicGridStore.select(fromBasicDataGridReducer.getLoadingMoreData, QuickPriceHistoryContext.gridId);
    this.hasMoreDataOnServer$ = this.basicGridStore.select(fromBasicDataGridReducer.getHasMoreDataOnServer, QuickPriceHistoryContext.gridId);
    this.isQuickPriceHistoryOpen$ = this.store.select(fromComphubMainReducer.getIsQuickPriceHistoryOpen);
    this.isQuickPriceHistoryNoteDismissed$ = this.settingsService.selectUiPersistenceSetting<boolean>(
      FeatureAreaConstants.CompHub, UiPersistenceSettingConstants.QuickPriceHistoryNoteDismissed
    );
    this.loadingJobDataHistory$ = this.store.select(fromComphubMainReducer.getLoadingJobDataHistory);
    this.loadingJobDataErrorMessage$ = this.store.select(fromComphubMainReducer.getLoadingJobDataHistoryErrorMessage);
  }

  ngOnInit(): void {
    this.hasMoreDataOnServerSubscription = this.hasMoreDataOnServer$.subscribe(value => this.hasMoreDataOnServer = value);
    this.isQuickPriceHistoryOpenSubscription = this.isQuickPriceHistoryOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.basicGridStore.dispatch(new fromBasicDataGridActions.GetData(QuickPriceHistoryContext.gridId));
      }
    });
    this.workflowContextSub = this.workflowContext$.subscribe(x => {
      this.isPeerQuickPriceType = x.quickPriceType === QuickPriceType.PEER;
    });
  }

  ngAfterViewInit(): void {
    const fieldTemplates = {
      'QuickPrice_CompletedPricingHistory_Base50': { Template: this.base50Column }
    };
    this.gridSettings = {
      ...this.gridSettings,
      FieldTemplates: fieldTemplates
    };
  }

  ngOnDestroy(): void {
    this.hasMoreDataOnServerSubscription.unsubscribe();
    this.isQuickPriceHistoryOpenSubscription.unsubscribe();
    this.workflowContextSub.unsubscribe();
  }

  handleScrollBottom(): void {
    if (this.hasMoreDataOnServer) {
      this.basicGridStore.dispatch(new fromBasicDataGridActions.GetMoreData(QuickPriceHistoryContext.gridId));
    }
  }

  close(): void {
    this.store.dispatch(new fromComphubPageActions.SetQuickPriceHistoryModalOpen(false));
  }

  handleCellClicked(event: any): void {
    const request = this.buildJobPricedHistorySummaryRequest(event);
    this.store.dispatch(new fromQuickPriceHistoryActions.GetJobPricedHistorySummary(request));
  }

  closeNote(): void {
    this.settingsService.updateUiPersistenceSettingValue<boolean>(
      FeatureAreaConstants.CompHub,
      UiPersistenceSettingConstants.QuickPriceHistoryNoteDismissed,
      'true');
  }

  private buildJobPricedHistorySummaryRequest(data: any): JobPricedHistorySummaryRequest {
    return {
      CompletedPricingHistoryId: data.QuickPrice_CompletedPricingHistory_QuickPrice_CompletedPricingHistory_ID,
      IsPeerQuickPriceType: this.isPeerQuickPriceType
    };
  }

}
