import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { userVoiceUrl } from 'libs/core/functions';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum, TileTypes } from 'libs/models';

import {
  generateTilePreviewBasicListFromTile, generateTilePreviewChartFromTile, generateTilePreviewChartWithCalendarFromTile,
  generateTilePreviewChartWithListFromTile, generateTilePreviewIconFromTile, generateTilePreviewListFromTile, generateTilePreviewPeerFromTile,
  generateTilePreviewPlaceHolderFromTile, Tile, TilePreviewBase, TilePreviewPeer, TilePreviewType, TilePreviewTypes
} from '../../models';
import { environment } from 'environments/environment';


@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit, OnDestroy {
  @Input() tile: Tile;
  @Input() userId: number;

  tilePreviewType: TilePreviewType = new TilePreviewType();
  clientAppRoot = '/' + environment.hostPath + '/';
  ngAppRoot = environment.ngAppRoot;
  previewModel: TilePreviewBase;
  highlightMarketingContent = false;
  enableCoreJdmInClient = false;
  enableCoreJdmInClient$: Observable<boolean>;
  enableCoreJdmInClientSubscription: Subscription;

  constructor(private settingsService: SettingsService) {
    this.enableCoreJdmInClient$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMCoreUseClient
    );
   }

  generatePreviewModel(tile: Tile): TilePreviewBase {
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
      case TilePreviewTypes.Peer:
        return <TilePreviewPeer>{...generateTilePreviewPeerFromTile(tile), TileUrl: this.getTileHref(tile) };
      case TilePreviewTypes.TotalRewards:
        return {...generateTilePreviewListFromTile(tile), PreviewType: TilePreviewTypes.TotalRewards };
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
    this.previewModel = this.generatePreviewModel(this.tile);
    this.enableCoreJdmInClientSubscription = this.enableCoreJdmInClient$.subscribe((setting) => this.enableCoreJdmInClient = setting);
  }

  ngOnDestroy() {
    this.enableCoreJdmInClientSubscription.unsubscribe();
  }

  getTileHref(tile: Tile) {
    if (tile.Type === 'JobDescriptions' && this.enableCoreJdmInClient === true) {
      return this.clientAppRoot + tile.Url;
    }
    const url = this.getUrl(tile.NgAppLink, tile.Url);
    if (tile.Type === TileTypes.Ideas) {
      return userVoiceUrl(url, this.userId);
    }
    return url;
  }

  getUrl(ngApplink: boolean, url: string): string {
    if (ngApplink) {
      return this.ngAppRoot + url;
    }
    return url;
  }
}
