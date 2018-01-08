import { Component, Input, OnInit } from '@angular/core';

import { environment } from 'environments/environment';

import { Tile, TilePreviewTypes } from '../../models';
import { TilePreviewType } from '../../models';
import { TilePreviewBase } from '../../models/tile-preview-base.model';
import { TilePreviewIcon } from '../../models/tile-preview-icon.model';

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

  static generatePreviewModelForIcon(tile: Tile): TilePreviewIcon {
   if (tile.Payload === undefined) {
      return {
        containsPayLoad: false,
        iconClass: tile.IconClass,
        iconSize: 'fa-10x',
        cssClassName: 'preview-tile-icon'
      };
    }
    return {
      containsPayLoad: true,
      iconClass: tile.IconClass,
      iconSize: 'fa-4x',
      cssClassName: 'preview-tile-icon-details',
      title: tile.Payload.title,
      subTitle: tile.Payload.subTitle,
      detailsDictionary: tile.Payload.payloadDetails
    };
  }

  static generatePreviewModel(tile: Tile): TilePreviewBase {
    switch (tile.PreviewType) {
      case TilePreviewTypes.Icon:
        return TileComponent.generatePreviewModelForIcon(tile);
      default:
        return {
          iconClass: tile.IconClass
        };
    }
  }

  ngOnInit(): void {
    this.previewModel = TileComponent.generatePreviewModel(this.tile);
  }
}
