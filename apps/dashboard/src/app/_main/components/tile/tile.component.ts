import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'environments/environment';

import {
  Tile, TilePreviewTypes, TilePreviewBase, TilePreviewIcon, TilePreviewType,
  TilePreviewChart
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
        return TileComponent.generatePreviewModelForIcon(tile);
      case TilePreviewTypes.Chart:
        return TileComponent.generatePreviewModelForChart(tile);
      default:
        return {
          IconClass: tile.IconClass
        };
    }
  }

  static generatePreviewModelForIcon(tile: Tile): TilePreviewIcon {

    if (tile.TilePreviewData === undefined ||
        tile.TilePreviewData === null ||
        tile.TilePreviewData.length === 0 ||
        tile.TilePreviewData[0] === undefined) {
      return {
        ContainsPayLoad: false,
        IconClass: tile.IconClass,
        IconSize: 'fa-10x',
        CssClassName: 'preview-tile-icon'
      };
    }
    const previewData = tile.TilePreviewData[0];
    const title = previewData.Title !== undefined ? previewData.Title : undefined;
    const subTitle = previewData.SubTitle !== undefined ? previewData.SubTitle : undefined;
    const detailData = previewData.DetailData !== undefined && previewData.DetailData.length > 0 ? previewData.DetailData :  undefined;
    return {
      ContainsPayLoad: true,
      IconClass: tile.IconClass,
      IconSize: 'fa-4x',
      CssClassName: 'preview-tile-icon-small',
      Title: title,
      SubTitle: subTitle,
      DetailData: detailData,
    };
  }

  static generatePreviewModelForChart(tile: Tile): TilePreviewChart {
    return {
      ChartType: tile.ChartType,
      ChartLabel: tile.ChartLabel,
      ChartComponentData: tile.TilePreviewData,
    };
  }

  ngOnInit(): void {
    this.previewModel = TileComponent.generatePreviewModel(this.tile);
  }
}
