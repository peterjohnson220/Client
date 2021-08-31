import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { ComphubType } from 'libs/constants';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import { ComphubPages } from '../../../../_shared/data';
import { ComphubBasePageDirective } from '../../../../_shared/containers/pages';

import * as fromComphubPeerTrendsDataReducers from '../../../reducers';
import * as fromTrendsSummaryCardActions from '../../../actions/trends-summary-card.actions';
import { TrendsJobsCardComponent } from '../../cards';

@Component({
  selector: 'pf-trends-page',
  templateUrl: './trends.page.html',
  styleUrls: ['./trends.page.scss']
})
export class TrendsPageComponent extends ComphubBasePageDirective implements OnInit, OnDestroy  {
  @ViewChild(TrendsJobsCardComponent) public trendsJobsCardComponent: TrendsJobsCardComponent;

  exchangeJobSelectionCount$: Observable<number>;

  private trendsWorkflowContextSub: Subscription;
  private exchangeJobSelectionCountSub: Subscription;

  trendsPages = ComphubPages;
  validJobSelectionCount: boolean;
  selectedPageId: ComphubPages;

  constructor(
    private trendsStore: Store<fromComphubPeerTrendsDataReducers.State>,
    protected comphubSharedStore: Store<fromComphubSharedReducer.State>,
    protected basicGridStore: Store<fromBasicDataGridReducer.State>,
    protected layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(comphubSharedStore, basicGridStore, layoutWrapperStore, changeDetectorRef);

    this.exchangeJobSelectionCount$ = this.trendsStore.select(fromComphubPeerTrendsDataReducers.getSelectedExchangeJobCount);
  }
  get nextButtonEnabled(): boolean {
    return !!this.validJobSelectionCount && this.workflowContext.selectedPageId === ComphubPages.TrendsJobs;
  }
  ngOnInit() {
    this.comphubSharedStore.dispatch(new fromComphubPageActions.SetComphubTypeInWorkflowContext(ComphubType.TRENDS));
    this.comphubSharedStore.dispatch(new fromComphubPageActions.GetExchangeDataSets());
    super.ngOnInit();

    this.exchangeJobSelectionCountSub = this.exchangeJobSelectionCount$.subscribe(ejsCount => {
      this.validJobSelectionCount = ejsCount > 0 && ejsCount <= 100;
    });
    this.trendsWorkflowContextSub = this.workflowContext$.pipe(filter(wfc => wfc.comphubType === ComphubType.TRENDS)).subscribe(
      (wfc) => {
        switch (wfc.selectedPageId) {
          case ComphubPages.TrendsLanding:
            this.trendsJobsCardComponent.reset();
            this.trendsStore.dispatch(new fromSearchFeatureActions.ResetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));
            break;
          case ComphubPages.TrendsJobs:
            if (wfc.lastAccessedPageId === ComphubPages.TrendsLanding) {
              this.trendsJobsCardComponent.setContext();
            }
            this.trendsStore.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.PeerExchangeJob));
            break;
          case ComphubPages.TrendsScopes:
            this.trendsStore.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.ExchangeExplorer));
            break;
          case ComphubPages.TrendsSummary:
            break;
          default:
            break;
        }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  handleSaveButtonClicked(): void {
    this.trendsStore.dispatch(new fromTrendsSummaryCardActions.ToggleSaveTrendModal({displayModal: true}));
  }
}
