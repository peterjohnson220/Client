import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TreeViewItem } from 'libs/ui/common/multi-select-treeview/models';
import { AsyncStateObj } from 'libs/models/state';
import { MultiSelectItemGroup } from 'libs/ui/common/multi-select-dropdown';

import * as fromPayMarketsMainReducer from '../../reducers';
import * as fromGridActionsBarActions from '../../actions/grid-actions-bar.actions';

@Component({
  selector: 'pf-paymarkets-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent implements OnInit {
  industries$: Observable<AsyncStateObj<TreeViewItem[]>>;
  sizes$: Observable<AsyncStateObj<MultiSelectItemGroup[]>>;
  selectedSizes$: Observable<string[]>;

  constructor(
    private store: Store<fromPayMarketsMainReducer.State>
  ) {
    this.sizes$ = this.store.select(fromPayMarketsMainReducer.getCompanyScopeSizes);
    this.selectedSizes$ = this.store.select(fromPayMarketsMainReducer.getSelectedSizes);
    this.industries$ = this.store.select(fromPayMarketsMainReducer.getCompanyIndustries);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyScopeSizes());
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyIndustries());
  }

  handleSelectedSizesChanged(sizesStates: MultiSelectItemGroup[]): void {
    this.store.dispatch(new fromGridActionsBarActions.UpdateSelectedSizes(sizesStates));
  }

   handleIndustryFilterChanged(values: string[]) {
    this.store.dispatch(new fromGridActionsBarActions.SetSelectedIndustries(values));
  }

}
