import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import { CompanyClientTypeConstants, ComphubType } from 'libs/constants';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import { QuickPriceHistoryContext } from '../../../../_shared/models';

import { ComphubBasePageDirective } from '../../../../_shared/containers/pages/comphub-base';

@Component({
  selector: 'pf-quick-price-page',
  templateUrl: './quick-price.page.html',
  styleUrls: ['./quick-price.page.scss']
})
export class QuickPricePageComponent extends ComphubBasePageDirective implements OnInit, OnDestroy {
  showJobsHistorySummary$: Observable<boolean>;
  historyGridInitialized$: Observable<boolean>;

  private userContextSub: Subscription;
  private historyGridInitializedSubscription: Subscription;
  private showJobHistorySummarySubscription: Subscription;

  showJobHistorySummary: boolean;

  constructor(
    private quickPriceStore: Store<fromComphubSharedReducer.State>,
    private quickPriceBasicGridStore: Store<fromBasicDataGridReducer.State>,
    private quickPriceLayoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private quickPriceChangeDetectorRef: ChangeDetectorRef
  ) {
    super(quickPriceStore, quickPriceBasicGridStore, quickPriceLayoutWrapperStore, quickPriceChangeDetectorRef);
    this.showJobsHistorySummary$ = this.quickPriceStore.select(fromComphubSharedReducer.getShowJobPricedHistorySummary);
  }

  ngOnInit() {
    super.ngOnInit();

    this.userContextSub = this.userContext$.subscribe(uc => {
      if (uc.ClientType === CompanyClientTypeConstants.PEER_AND_ANALYSIS || uc.ClientType === CompanyClientTypeConstants.PEER) {
        this.quickPriceStore.dispatch(new fromComphubPageActions.SetComphubTypeInWorkflowContext(ComphubType.PEER));
        this.quickPriceStore.dispatch(new fromComphubPageActions.GetExchangeDataSets());
      } else if (uc.CompanySystemUserGroupsGroupName === this.systemUserGroupNames.SmallBusiness) {
        this.quickPriceStore.dispatch(new fromComphubPageActions.SetComphubTypeInWorkflowContext(ComphubType.SMALL_BUSINESS));
        this.quickPriceStore.dispatch(new fromComphubPageActions.GetCountryDataSets());
      } else {
        this.quickPriceStore.dispatch(new fromComphubPageActions.SetComphubTypeInWorkflowContext(ComphubType.ENTERPRISE));
        this.quickPriceStore.dispatch(new fromComphubPageActions.GetCountryDataSets());
      }
      if (uc?.UserId) {
        this.initHistoryGrid(uc.UserId);
      }
    });

    this.historyGridInitializedSubscription = this.historyGridInitialized$.subscribe(initialized => {
      if (initialized) {
        this.quickPriceBasicGridStore.dispatch(new fromBasicDataGridActions.GetCount(QuickPriceHistoryContext.gridId));
      }
    });

    this.showJobHistorySummarySubscription = this.showJobsHistorySummary$.subscribe(x => {
      this.showJobHistorySummary = x;
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.userContextSub.unsubscribe();
    this.historyGridInitializedSubscription.unsubscribe();
    this.showJobHistorySummarySubscription.unsubscribe();
  }

  private initHistoryGrid(userId: number): void {
    const filters: DataViewFilter[] = QuickPriceHistoryContext.getFilters(userId);
    this.quickPriceBasicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      QuickPriceHistoryContext.gridId,
      {
        BaseEntity: QuickPriceHistoryContext.baseEntity,
        ApplyDefaultFilters: false,
        Fields: QuickPriceHistoryContext.fields,
        Filters: filters,
        DefaultSort: QuickPriceHistoryContext.defaultSort
      }
    ));
  }
}
