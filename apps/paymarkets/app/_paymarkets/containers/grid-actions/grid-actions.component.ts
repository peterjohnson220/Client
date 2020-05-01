import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

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
  sizes$: Observable<AsyncStateObj<MultiSelectItemGroup[]>>;
  selectedSizes$: Observable<string[]>;

  constructor(
    private store: Store<fromPayMarketsMainReducer.State>
  ) {
    this.sizes$ = this.store.select(fromPayMarketsMainReducer.getCompanyScopeSizes);
    this.selectedSizes$ = this.store.select(fromPayMarketsMainReducer.getSelectedSizes);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyScopeSizes());
  }

  handleSelectedSizesChanged(sizesStates: MultiSelectItemGroup[]): void {
    this.store.dispatch(new fromGridActionsBarActions.UpdateSelectedSizes(sizesStates));
  }
}
