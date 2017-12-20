import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { DragulaService } from 'ng2-dragula';

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

  constructor(private store: Store<fromTileGridReducer.State>,
              private dragulaService: DragulaService) {
    // Register Services
    dragulaService.dropModel.subscribe((value) => {
      TileGridComponent.onDrop(value.slice(1));
    });

    // Register state
    this.loading$ = this.store.select(fromTileGridReducer.getTileGridLoading);
    this.loadingError$ = this.store.select(fromTileGridReducer.getTileGridLoadingError);
    this.tiles$ = this.store.select(fromTileGridReducer.getTileGridTiles);
  }

  // Helper
  private static getTileIndex(tile: any) {
    return [].slice.call(tile.parentElement.children).indexOf(tile);
  }

  // Events
  private static onDrop(args) {
    // const [tile, grid] = args; (tile and grid example)
    const [tile] = args;
    const tileIndex = TileGridComponent.getTileIndex(tile);
    console.log('emit event reorder for index ' + tileIndex);
  }

  handleTilesGridReload() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles());
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles());
  }
}
