import { Component, OnInit } from '@angular/core';
import { TileService } from '../../services/tile.service';
import { Tile } from '../../models';

@Component({
  selector: 'pf-tile-container',
  templateUrl: './tile-grid.component.html',
  styleUrls: [ './tile-grid.component.scss' ]
})
export class TileGridComponent implements OnInit {
  tiles: Tile[];

  constructor(private tileService: TileService) {
  }

  ngOnInit() {
    this.tiles = this.tileService.getTiles();
  }
}
