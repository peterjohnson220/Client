import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { userVoiceUrl } from 'libs/core/functions';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum, TileTypes } from 'libs/models';

import {
  generateTilePreviewBasicListFromTile, generateTilePreviewChartFromTile, generateTilePreviewChartWithCalendarFromTile,
  generateTilePreviewChartWithListFromTile, generateTilePreviewIconFromTile, generateTilePreviewListFromTile, generateTilePreviewPeerFromTile,
  generateTilePreviewPlaceHolderFromTile, Tile, TilePreviewBase, TilePreviewPeer, TilePreviewType, TilePreviewTypes
} from '../../models';
import { environment } from 'environments/environment';

import * as fromMarketingReducer from '../../reducers';
import * as fromMarketingActions from 'libs/features/marketing-settings/marketing-settings.actions';

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

  marketingVideoMouseOver = false;
  marketingVideoSafeIframeUrl: SafeResourceUrl;
  marketingVideoUrl$: Observable<string>;
  marketingVideoUrlSubscription: Subscription;

  constructor(private settingsService: SettingsService,
    public store: Store<fromMarketingReducer.State>,
    private sanitizer: DomSanitizer) {
    this.enableCoreJdmInClient$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMCoreUseClient
    );
    this.marketingVideoUrl$ = this.store.select(fromMarketingReducer.getMarketingVideoUrl);
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
      case TilePreviewTypes.WhatIsNew: {
        this.store.dispatch(new fromMarketingActions.GetMarketingVideoUrl());
        this.marketingVideoUrlSubscription  = this.marketingVideoUrl$.subscribe(result => {
          if (result) {
            this.marketingVideoSafeIframeUrl = this.getMarketingVideoIframeUrl(result);
          }
        });
        return generateTilePreviewIconFromTile(tile);
      }
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
    if (this.marketingVideoUrlSubscription) {
      this.marketingVideoUrlSubscription.unsubscribe();
    }
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


  getMarketingVideoIframeUrl (url: string): any {
    // extract video id from the url that looks like this: https://payfactors.wistia.com/medias/95g6ckx96u
    const videoIdRegex = new RegExp(/[^/]*$/);
    const videoId = url.length ? videoIdRegex.exec(url)[0] : '95g6ckx96u';
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://fast.wistia.net/embed/iframe/${videoId}?seo=false&videoFoam=true`);
  }

  onMarketingVideoMouseOver() {
    this.marketingVideoMouseOver = true;
  }

  onMarketingVideoMouseLeave () {
    this.marketingVideoMouseOver = false;
  }

  handleLearnMore() {
    window.open('https://info.payfactors.com/demo');

  }
}

