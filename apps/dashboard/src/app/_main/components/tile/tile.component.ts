import { Component, Input } from '@angular/core';

import { Tile, TileType } from '../../models';

@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  tileType: TileType = new TileType();
  @Input() tile: Tile;
}
