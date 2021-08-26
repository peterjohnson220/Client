import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { userVoiceUrl } from 'libs/core/functions';
import { SettingsService } from 'libs/state/app-context/services';
import { TileTypes } from 'libs/models';
import * as fromMarketingActions from 'libs/features/infrastructure/marketing-settings/marketing-settings/actions/marketing-settings.actions';
import { AppConstants } from 'libs/constants';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

import {
  generateTilePreviewBasicListFromTile, generateTilePreviewChartFromTile, generateTilePreviewChartWithCalendarFromTile,
  generateTilePreviewChartWithListFromTile, generateTilePreviewIconFromTile, generateTilePreviewListFromTile, generateTilePreviewPeerFromTile,
  generateTilePreviewPlaceHolderFromTile, Tile, TilePreviewBase, TilePreviewPeer, TilePreviewType, TilePreviewTypes
} from '../../models';
import * as fromMarketingReducer from '../../reducers';

@Component({
  selector: 'pf-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit, OnDestroy {
  @Input() tile: Tile;
  @Input() userId: number;

  tilePreviewType: TilePreviewType = new TilePreviewType();
  clientAppRoot = '/' + AppConstants.HostPath + '/';
  previewModel: TilePreviewBase;
  highlightMarketingContent = false;

  marketingVideoMouseOver = false;
  marketingVideoSafeIframeUrl: SafeResourceUrl;
  marketingVideoUrl$: Observable<string>;
  marketingVideoUrlSubscription: Subscription;

  payscaleBrandingFeatureFlag: RealTimeFlag = { key: FeatureFlags.PayscaleBranding, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(private settingsService: SettingsService,
              public store: Store<fromMarketingReducer.State>,
              private sanitizer: DomSanitizer,
              private featureFlagService: AbstractFeatureFlagService) {
    this.marketingVideoUrl$ = this.store.select(fromMarketingReducer.getMarketingVideoUrl);
    this.featureFlagService.bindEnabled(this.payscaleBrandingFeatureFlag, this.unsubscribe$);
  }

  generatePreviewModel(tile: Tile): TilePreviewBase {
    switch (tile.PreviewType) {
      case TilePreviewTypes.Icon:
        return generateTilePreviewIconFromTile(tile, this.payscaleBrandingFeatureFlag.value);
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
        return <TilePreviewPeer>{...generateTilePreviewPeerFromTile(tile, this.payscaleBrandingFeatureFlag.value), TileUrl: this.getTileHref(tile)};
      case TilePreviewTypes.TotalRewards:
        return {...generateTilePreviewListFromTile(tile), PreviewType: TilePreviewTypes.TotalRewards};
      case TilePreviewTypes.WhatIsNew: {
        this.store.dispatch(new fromMarketingActions.GetMarketingVideoUrl());
        this.marketingVideoUrlSubscription = this.marketingVideoUrl$.subscribe(result => {
          if (result) {
            this.marketingVideoSafeIframeUrl = this.getMarketingVideoIframeUrl(result);
          }
        });
        return generateTilePreviewIconFromTile(tile, this.payscaleBrandingFeatureFlag.value);
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
  }

  ngOnDestroy() {
    if (this.marketingVideoUrlSubscription) {
      this.marketingVideoUrlSubscription.unsubscribe();
    }
    this.unsubscribe$.next();
  }

  getTileHref(tile: Tile) {
    if (tile.Type === 'JobDescriptions') {
      return this.clientAppRoot + tile.Url;
    }

    if (tile.Type === TileTypes.Ideas) {
      return userVoiceUrl(tile.Url, this.userId);
    }

    return tile.Url;
  }

  getMarketingVideoIframeUrl(url: string): any {
    // extract video id from the url that looks like this: https://payfactors.wistia.com/medias/95g6ckx96u
    const videoIdRegex = new RegExp(/[^/]*$/);
    const videoId = url.length ? videoIdRegex.exec(url)[0] : '95g6ckx96u';
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://fast.wistia.net/embed/iframe/${videoId}?seo=false&videoFoam=true`);
  }

  onMarketingVideoMouseOver() {
    this.marketingVideoMouseOver = true;
  }

  onMarketingVideoMouseLeave() {
    this.marketingVideoMouseOver = false;
  }

  handleLearnMore() {
    window.open('https://info.payfactors.com/demo');
  }
}

