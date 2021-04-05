import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import { ComphubType } from 'libs/constants';

import { ComphubPageComponent } from '../comphub';
import { ComphubPages } from '../../../data';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';

@Component({
  selector: 'pf-trends-page',
  templateUrl: './trends.page.html',
  styleUrls: ['../comphub/comphub.page.scss', './trends.page.scss']
})
export class TrendsPageComponent extends ComphubPageComponent implements OnInit, OnDestroy  {

  trendsPages = ComphubPages;

  constructor(
    private trendsStore: Store<fromComphubMainReducer.State>,
    private trendsBasicGridStore: Store<fromBasicDataGridReducer.State>,
    private trendsLayoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private trendsChangeDetectorRef: ChangeDetectorRef
  ) {
    super(trendsStore, trendsBasicGridStore, trendsLayoutWrapperStore, trendsChangeDetectorRef);
  }

  ngOnInit() {
    this.trendsStore.dispatch(new fromComphubPageActions.SetComphubTypeInWorkflowContext(ComphubType.TRENDS));
    this.trendsStore.dispatch(new fromComphubPageActions.GetExchangeDataSets());

    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
