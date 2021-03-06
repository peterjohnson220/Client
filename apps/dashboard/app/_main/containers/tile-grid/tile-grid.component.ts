import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';
import { ReorderTileRequest } from 'libs/models/dashboard';

import * as fromTileGridReducer from '../../reducers';
import * as fromTileGridActions from '../../actions/tile-grid.actions';
import { Tile } from '../../models';

@Component({
  selector: 'pf-tile-grid',
  templateUrl: './tile-grid.component.html',
  styleUrls: ['./tile-grid.component.scss']
})
export class TileGridComponent implements OnInit, OnDestroy {
  loadingError$: Observable<boolean>;
  tiles$: Observable<Tile[]>;
  tiles: Tile[];
  userContext$: Observable<UserContext>;
  dragSubs: Subscription;

  constructor(private store: Store<fromTileGridReducer.State>,
              private dragulaService: DragulaService) {
    this.dragSubs = new Subscription();
    // subscribe to dragulaService events
    this.dragSubs.add(this.dragulaService.dropModel('tile-grid-bag')
        .subscribe((value) => {
          this.onDropModel(value);
        })
    );

    // Register state
    this.loadingError$ = this.store.select(fromTileGridReducer.getTileGridLoadingError);
    this.tiles$ = this.store.select(fromTileGridReducer.getTileGridTiles);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  setTiles() {
    this.tiles$.subscribe(tilesArray => {
      this.tiles = tilesArray;
    });
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles(true));
    this.setTiles();
  }

  // Events
  private onDropModel(args) {
    let nextTileId = this.tiles[args.targetIndex].Id;
    if (nextTileId && nextTileId > 0 ) {
      if (args.targetIndex > args.sourceIndex) {
        const nextTileIndex = args.targetIndex < (this.tiles.length - 1) ? args.targetIndex + 1 : null;
        nextTileId = nextTileIndex !== null ? this.tiles[ nextTileIndex ].Id : null;
      }
      const reorderTileRequest: ReorderTileRequest = {
        movedUserTileId: this.tiles[ args.sourceIndex ].Id,
        newNextUserTileId: nextTileId
      };
      this.store.dispatch(new fromTileGridActions.ReorderTiles(reorderTileRequest));
    }
  }

  handleTilesGridReload() {
    this.store.dispatch(new fromTileGridActions.LoadingTiles(true));
  }

  ngOnDestroy(): void {
    this.dragSubs.unsubscribe();
  }
}
