import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTileGridReducer from '../../reducers';
import * as fromTileGridActions from '../../actions/tile-grid.actions';
import { Tile } from '../../models';

@Component({
  selector: 'pf-tile-grid',
  templateUrl: './tile-grid.component.html',
  styleUrls: ['./tile-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileGridComponent implements OnInit {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  tiles$: Observable<Tile[]>;

  constructor(private store: Store<fromTileGridReducer.State>) {
    // Register state
    this.loading$ = this.store.select(fromTileGridReducer.getTileGridLoading);
    this.loadingError$ = this.store.select(fromTileGridReducer.getTileGridLoadingError);
    this.tiles$ = this.store.select(fromTileGridReducer.getTileGridTiles);
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
