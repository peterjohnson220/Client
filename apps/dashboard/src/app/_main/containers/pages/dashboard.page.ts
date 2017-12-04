import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { DashboardTile } from 'libs/models/dashboard';

import * as fromDashboardActions from '../../actions/dashboard.actions';
import * as fromDashboardReducer from '../../reducers';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  tilesLoading$: Observable<boolean>;
  tilesLoadingError$: Observable<boolean>;
  tiles$: Observable<DashboardTile[]>;

  constructor(private store: Store<fromDashboardReducer.State>) {
    this.tilesLoading$ = this.store.select(fromDashboardReducer.getTilesLoading);
    this.tilesLoadingError$ = this.store.select(fromDashboardReducer.getTilesLoadingError);
    this.tiles$ = this.store.select(fromDashboardReducer.getTiles);
  }

  // Events
  handleTilesReload() {
    this.store.dispatch(new fromDashboardActions.LoadingTiles());
  }


  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromDashboardActions.LoadingTiles());
  }
}
