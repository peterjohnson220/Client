import { Component, Input } from '@angular/core';

import { Tile } from '../../models';
import { TilePreviewType } from '../../models';

@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  tilePreviewType: TilePreviewType = new TilePreviewType();
  @Input() tile: Tile;
}
