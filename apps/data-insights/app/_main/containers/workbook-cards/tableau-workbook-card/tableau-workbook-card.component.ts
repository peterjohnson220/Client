import { Component, Input, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDashboardsActions from '../../../actions/dashboards.actions';
import { Workbook } from '../../../models';
import { WorkbookCardComponent } from '../workbook-card';

@Component({
  selector: 'pf-tableau-workbook-card',
  templateUrl: './tableau-workbook-card.component.html',
  styleUrls: ['./tableau-workbook-card.component.scss']
})
export class TableauWorkbookCardComponent {
  @Input() workbook: Workbook;

  @ViewChild(WorkbookCardComponent) public workbookCard: WorkbookCardComponent;
  showingViewPopover = false;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}

  handleOpenViewsClicked(): void {
    this.showingViewPopover = true;
    if (!this.workbook.Views || this.workbook.Views.loadingError) {
      this.store.dispatch(new fromDashboardsActions.GetCompanyWorkbookViews({ workbookId: this.workbook.WorkbookId }));
    }
  }

  handleViewsHidden(): void {
    this.showingViewPopover = false;
    this.workbookCard.resetDisplayActionsOverlay();
  }
}
