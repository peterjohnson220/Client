import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTileGridActions from '../../actions/tile-grid.actions';
import * as fromTileGridReducer from '../../reducers';
import { Tile } from '../../models';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent implements OnInit {
  tilesLoading$: Observable<boolean>;
  tilesLoadingError$: Observable<boolean>;
  tiles$: Observable<Tile[]>;

  constructor(private store: Store<fromTileGridReducer.State>) {
    this.tilesLoading$ = this.store.select(fromTileGridReducer.getTilesLoading);
    this.tilesLoadingError$ = this.store.select(fromTileGridReducer.getTilesLoadingError);
    this.tiles$ = this.store.select(fromTileGridReducer.getTiles);
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
