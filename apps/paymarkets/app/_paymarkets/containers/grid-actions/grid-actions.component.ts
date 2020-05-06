import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { GroupedListItem } from 'libs/models';
import { AsyncStateObj } from 'libs/models/state';

import * as fromPayMarketsMainReducer from '../../reducers';
import * as fromGridActionsBarActions from '../../actions/grid-actions-bar.actions';

@Component({
  selector: 'pf-paymarkets-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent implements OnInit {
  industries$: Observable<AsyncStateObj<GroupedListItem[]>>;
  sizes$: Observable<AsyncStateObj<GroupedListItem[]>>;
  locations$: Observable<AsyncStateObj<GroupedListItem[]>>;

  constructor(
    private store: Store<fromPayMarketsMainReducer.State>
  ) {
    this.sizes$ = this.store.select(fromPayMarketsMainReducer.getCompanyScopeSizes);
    this.industries$ = this.store.select(fromPayMarketsMainReducer.getCompanyIndustries);
    this.locations$ = this.store.select(fromPayMarketsMainReducer.getLocations);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyScopeSizes());
    this.store.dispatch(new fromGridActionsBarActions.GetCompanyIndustries());
    this.store.dispatch(new fromGridActionsBarActions.GetLocations());
  }

  handleSelectedSizesChanged(sizesStates: string[]): void {
    this.store.dispatch(new fromGridActionsBarActions.UpdateSelectedSizes(sizesStates));
  }

   handleIndustryFilterChanged(values: string[]) {
    this.store.dispatch(new fromGridActionsBarActions.SetSelectedIndustries(values));
  }

  handleLocationFilterChanged(values: string[]): void {
    this.store.dispatch(new fromGridActionsBarActions.SetSelectedLocations(values));
  }

}
