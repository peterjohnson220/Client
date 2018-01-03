import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';

import { Tile } from '../../models';
import { TilePreviewType } from '../../models';


@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  tilePreviewType: TilePreviewType = new TilePreviewType();
  ngAppRoot = environment.ngAppRoot;
  @Input() tile: Tile;
}
