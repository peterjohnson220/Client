import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import { ComphubType } from 'libs/constants';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import { ComphubPages } from '../../../../_shared/data';
import { ComphubBasePageDirective } from '../../../../_shared/containers/pages/comphub-base';

import * as fromComphubPeerTrendsDataReducers from '../../../reducers';
import * as fromTrendsSummaryCardActions from '../../../actions/trends-summary-card.actions';

@Component({
  selector: 'pf-trends-page',
  templateUrl: './trends.page.html',
  styleUrls: ['./trends.page.scss']
})
export class TrendsPageComponent extends ComphubBasePageDirective implements OnInit, OnDestroy  {

  trendsPages = ComphubPages;

  constructor(
    private trendsStore: Store<fromComphubPeerTrendsDataReducers.State>,
    protected comphubSharedStore: Store<fromComphubSharedReducer.State>,
    protected basicGridStore: Store<fromBasicDataGridReducer.State>,
    protected layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(comphubSharedStore, basicGridStore, layoutWrapperStore, changeDetectorRef);
  }

  ngOnInit() {
    this.comphubSharedStore.dispatch(new fromComphubPageActions.SetComphubTypeInWorkflowContext(ComphubType.TRENDS));
    this.comphubSharedStore.dispatch(new fromComphubPageActions.GetExchangeDataSets());
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  handleSaveButtonClicked(): void {
    this.trendsStore.dispatch(new fromTrendsSummaryCardActions.ToggleSaveTrendModal({displayModal: true}));
  }
}
