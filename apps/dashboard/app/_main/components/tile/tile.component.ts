import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'environments/environment';

import { userVoiceUrl } from 'libs/core/functions';
import {
  Tile, TilePreviewTypes, TilePreviewBase, TilePreviewType, TileTypes,
  generateTilePreviewIconFromTile, generateTilePreviewChartFromTile,
  generateTilePreviewListFromTile, generateTilePreviewPlaceHolderFromTile,
  generateTilePreviewChartWithCalendarFromTile, generateTilePreviewChartWithListFromTile,
  generateTilePreviewBasicListFromTile
} from '../../models';


@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() tile: Tile;
  @Input() userId: number;

  tilePreviewType: TilePreviewType = new TilePreviewType();
  ngAppRoot = environment.ngAppRoot;
  previewModel: TilePreviewBase;
  highlightMarketingContent = false;

  static generatePreviewModel(tile: Tile): TilePreviewBase {
    switch (tile.PreviewType) {
      case TilePreviewTypes.Icon:
        return generateTilePreviewIconFromTile(tile);
      case TilePreviewTypes.Chart:
        return generateTilePreviewChartFromTile(tile);
      case TilePreviewTypes.ChartWithCalendar:
        return generateTilePreviewChartWithCalendarFromTile(tile);
      case TilePreviewTypes.List:
        return generateTilePreviewListFromTile(tile);
      case TilePreviewTypes.PlaceHolder:
        return generateTilePreviewPlaceHolderFromTile(tile);
      case TilePreviewTypes.ChartWithList:
        return generateTilePreviewChartWithListFromTile(tile);
      case TilePreviewTypes.BasicList:
        return generateTilePreviewBasicListFromTile(tile);
      default:
        return {
          PreviewType: TilePreviewTypes.Unknown,
          IconClass: tile.IconClass
        };
    }
  }

  onMouseOver() {
    if (this.tile.MarketingEnabled) {
        this.highlightMarketingContent = true;
    }
  }

  onMouseLeave() {
    if (this.tile.MarketingEnabled) {
      this.highlightMarketingContent = false;
    }
  }

  ngOnInit(): void {
    this.previewModel = TileComponent.generatePreviewModel(this.tile);
  }

  getTileHref(tile: Tile) {
    const url = this.getUrl(tile.NgAppLink, tile.Url);
    if (tile.Type === TileTypes.Ideas) {
      return userVoiceUrl(url, this.userId);
    }
    return url;
  }

  getUrl(ngApplink: boolean, url: string) {
    if (ngApplink) {
      return this.ngAppRoot + url;
    }
    return url;
  }
}
