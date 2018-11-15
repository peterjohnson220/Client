import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsReducer from '../../reducers';
import * as fromCommunityPostFilterOptionsActions from '../../actions/community-post-filter-options.actions';
import { FilterOptions } from '../../models/filter-options.model';

@Component({
  selector: 'pf-community-post-filter-options',
  templateUrl: './community-post-filter-options.component.html',
  styleUrls: ['./community-post-filter-options.component.scss'],
})
export class CommunityPostFilterOptionsComponent {
  filters$: Observable<FilterOptions>;

  constructor(public filterStore: Store<fromCommunityPostFilterOptionsReducer.State>,
              public store: Store<fromCommunityPostReducer.State>) {
    this.filters$ = this.filterStore.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions);
  }
  buttonClicked(type: string, item: any) {
    switch (type) {
      case 'tag':
        this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityTagFromFilterOptions(item));
        break;

      case 'category':
        this.filterStore.dispatch(new fromCommunityPostFilterOptionsActions.DeletingCommunityCategoryFromFilterOptions(item));
        break;
    }
  }
}
