import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromPeerDataReducers from '../../reducers';
import * as fromPeerMapActions from '../../actions/peer-map.actions';

@Component({
  selector: 'pf-peer-data-cut-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent {
  peerFilters$: Observable<any[]>;
  peerFiltersLoading$: Observable<boolean>;
  peerFiltersLoadingError$: Observable<boolean>;

  constructor(private store: Store<fromPeerDataReducers.State>) {
    this.peerFilters$ = this.store.select(fromPeerDataReducers.getPeerFilters);
    this.peerFiltersLoading$ = this.store.select(fromPeerDataReducers.getPeerFiltersLoading);
    this.peerFiltersLoadingError$ = this.store.select(fromPeerDataReducers.getPeerFiltersLoadingError);
  }

  handleOptionToggled(e: any) {
    this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilter(e));
  }
}
