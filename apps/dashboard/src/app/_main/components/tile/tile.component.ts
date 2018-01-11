import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'environments/environment';

import { Tile, TilePreviewTypes, TilePreviewBase, TilePreviewIcon, TilePreviewType } from '../../models';

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
      default:
        return {
          IconClass: tile.IconClass
        };
    }
  }

  static generatePreviewModelForIcon(tile: Tile): TilePreviewIcon {
    if (tile.Payload === undefined) {
      return {
        ContainsPayLoad: false,
        IconClass: tile.IconClass,
        IconSize: 'fa-10x',
        CssClassName: 'preview-tile-icon'
      };
    }
    return {
      ContainsPayLoad: true,
      IconClass: tile.IconClass,
      IconSize: 'fa-4x',
      CssClassName: 'preview-tile-icon-small',
      Title: tile.Payload.Title,
      SubTitle: tile.Payload.SubTitle,
      DetailsDictionary: tile.Payload.PayloadDetails
    };
  }

  ngOnInit(): void {
    this.previewModel = TileComponent.generatePreviewModel(this.tile);
  }
}
