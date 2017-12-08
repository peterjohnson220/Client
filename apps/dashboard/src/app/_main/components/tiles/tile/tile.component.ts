import { Component, Input } from '@angular/core';

import { Tile } from '../../../models/tile.model';

@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: [ './tile.component.scss' ]
})


export class TileComponent {

  @Input() tile: Tile;

  constructor() {
  }
}
