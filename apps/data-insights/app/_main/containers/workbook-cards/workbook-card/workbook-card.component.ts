import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { Workbook } from 'libs/features/surveys/reports/models';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDashboardsActions from '../../../actions/dashboards.actions';

@Component({
  selector: 'pf-workbook-card',
  templateUrl: './workbook-card.component.html',
  styleUrls: ['./workbook-card.component.scss']
})
export class WorkbookCardComponent {
  @Input() workbook: Workbook;
  @Input() displayActionsOverlayOverride: boolean;

  displayActionsOverlay: boolean;
  hoverWorkbookContainer: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}

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
