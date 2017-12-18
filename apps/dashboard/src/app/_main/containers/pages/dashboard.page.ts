import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

import * as fromTileGridActions from '../../actions/tile-grid.actions';
import * as fromTileGridReducer from '../../reducers';
import { Tile } from '../../models';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent implements OnInit {
  userContext$: Observable<UserContext>;
  tileGridLoading$: Observable<boolean>;
  tileGridLoadingError$: Observable<boolean>;
  tileGridTiles$: Observable<Tile[]>;

  constructor(private store: Store<fromTileGridReducer.State>) {
    this.tileGridLoading$ = this.store.select(fromTileGridReducer.getTileGridLoading);
    this.tileGridLoadingError$ = this.store.select(fromTileGridReducer.getTileGridLoadingError);
    this.tileGridTiles$ = this.store.select(fromTileGridReducer.getTileGridTiles);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  // Events
  handleTilesGridReload() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles());
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles());
  }
}
