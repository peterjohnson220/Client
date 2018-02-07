import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'environments/environment';

import {
  Tile, TilePreviewTypes, TilePreviewBase, TilePreviewType,
  generateTilePreviewIconFromTile, generateTilePreviewChartFromTile,
  generateTilePreviewListFromTile, generateTilePreviewPlaceHolderFromTile
} from '../../models';

@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() tile: Tile;

  tilePreviewType: TilePreviewType = new TilePreviewType();
  ngAppRoot = environment.ngAppRoot;
  previewModel: TilePreviewBase;

  static generatePreviewModel(tile: Tile): TilePreviewBase {
    switch (tile.PreviewType) {
      case TilePreviewTypes.Icon:
        return generateTilePreviewIconFromTile(tile);
      case TilePreviewTypes.Chart:
        return generateTilePreviewChartFromTile(tile);
      case TilePreviewTypes.List:
        return generateTilePreviewListFromTile(tile);
      case TilePreviewTypes.PlaceHolder:
        return generateTilePreviewPlaceHolderFromTile(tile);
      default:
        return {
          PreviewType: TilePreviewTypes.Unknown,
          IconClass: tile.IconClass
        };
    }
  }

  ngOnInit(): void {
    this.previewModel = TileComponent.generatePreviewModel(this.tile);
  }
}
