import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TileService } from '../../../services/tile.service';
import { Tile } from '../../../models';

@Component({
  selector: 'pf-tile-container',
  templateUrl: './tile-container.component.html',
  styleUrls: ['./tile-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TileContainerComponent implements OnInit {
  tiles: Tile[];

  constructor(private tileService: TileService) {}

  ngOnInit() {
    this.tiles = this.tileService.getTiles();
  }

}
