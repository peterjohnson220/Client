import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { DragulaService } from 'ng2-dragula';

import * as fromTileGridReducer from '../../reducers';
import * as fromTileGridActions from '../../actions/tile-grid.actions';

import { UserContext } from 'libs/models';
import { Tile } from '../../models';
import { ReorderTileRequest } from 'libs/models/dashboard';

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
  tiles: Tile[];
  movedTileId: number;

  @Input() userContext: UserContext;

  constructor(private store: Store<fromTileGridReducer.State>,
              private dragulaService: DragulaService) {
    // subscribe to dragulaService events
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value.slice(1));
    });

    this.dragulaService.over.subscribe((value) => {
      this.onOver(value.slice(1));
    });

    // Register state
    this.loading$ = this.store.select(fromTileGridReducer.getTileGridLoading);
    this.loadingError$ = this.store.select(fromTileGridReducer.getTileGridLoadingError);
    this.tiles$ = this.store.select(fromTileGridReducer.getTileGridTiles);
  }

  // Helpers
  private static getTileIndex(tile: any) {
    return [].slice.call(tile.parentElement.children).indexOf(tile);
  }

  setTiles() {
    this.tiles$.subscribe(tilesArray => {
      this.tiles = tilesArray;
    });
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles());
    this.setTiles();
  }

  // Events
  private onDropModel(args) {
    const [tile] = args;
    const tileIndex = TileGridComponent.getTileIndex(tile);
    const nextTileIndex = tileIndex < (this.tiles.length - 1) ? tileIndex + 1 : null;
    const nextTileId = nextTileIndex !== null ? this.tiles[nextTileIndex].Id : null;
    const reorderTileRequest: ReorderTileRequest = {
      movedUserTileId: this.movedTileId,
      newNextUserTileId: nextTileId
    };
    this.store.dispatch(new fromTileGridActions.ReorderTiles(reorderTileRequest));
  }

  private onOver(args) {
    const [tile] = args;
    const movedTileIndex = TileGridComponent.getTileIndex(tile);
    this.movedTileId = this.tiles[movedTileIndex].Id;
  }

  handleTilesGridReload() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles());
  }
}
