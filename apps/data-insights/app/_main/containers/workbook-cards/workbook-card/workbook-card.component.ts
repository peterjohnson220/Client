import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { Workbook } from 'libs/features/surveys/reports/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDashboardsActions from '../../../actions/dashboards.actions';


@Component({
  selector: 'pf-workbook-card',
  templateUrl: './workbook-card.component.html',
  styleUrls: ['./workbook-card.component.scss']
})
export class WorkbookCardComponent implements OnDestroy {
  @Input() workbook: Workbook;
  @Input() displayActionsOverlayOverride: boolean;

  displayActionsOverlay: boolean;
  hoverWorkbookContainer: boolean;
  unsubscribe$ = new Subject<void>();
  reportingScopesEnabled: RealTimeFlag = { key: FeatureFlags.TabularReportingScopes, value: false };
  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.featureFlagService.bindEnabled(this.reportingScopesEnabled, this.unsubscribe$);
  }

  ngOnDestroy(): void {
    this.unsubscribe$?.next();
  }

  handleMouseOverWorkbookContainer() {
    this.hoverWorkbookContainer = true;
    this.displayActionsOverlay = true;
  }

  handleMouseLeaveWorkbookContainer() {
    this.hoverWorkbookContainer = false;
    this.displayActionsOverlay = this.displayActionsOverlayOverride ? this.displayActionsOverlayOverride : false;
  }

  resetDisplayActionsOverlay(): void {
    this.displayActionsOverlay = this.hoverWorkbookContainer;
  }

  handleFavoriteClicked(workbook: Workbook) {
    if (workbook.IsFavorite) {
      this.store.dispatch(new fromDashboardsActions.RemoveWorkbookFavorite({ workbookId: workbook.WorkbookId }));
    } else {
      this.store.dispatch(new fromDashboardsActions.AddWorkbookFavorite({ workbookId: workbook.WorkbookId }));
    }
  }

  handleTagClicked() {
    this.store.dispatch(new fromDashboardsActions.OpenTagWorkbookModal({ workbookId: this.workbook.WorkbookId }));
  }

}
