import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import cloneDeep from 'lodash/cloneDeep';

import { TilePreviewPeer } from '../../../models';

@Component({
  selector: 'pf-tile-preview-peer',
  templateUrl: './tile-preview-peer.component.html',
  styleUrls: [ './tile-preview-peer.component.scss' ]
})
export class TilePreviewPeerComponent  implements OnInit, OnChanges {
  @ViewChild(NgbCarousel) carousel: NgbCarousel;
  @Input() model: TilePreviewPeer;
  @Input() payscaleBrandingFeatureFlag = false;

  exchangePreviewModels: any[];
  seriesItemHighlightStyle: any;
  legendLabelStyle: any;
  limitLabelText: any;

  ngOnInit() {
    this.exchangePreviewModels = cloneDeep(this.model.ExchangePreviewModels);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payscaleBrandingFeatureFlag) {
      this.seriesItemHighlightStyle = {
        opacity: 1,
        color: this.payscaleBrandingFeatureFlag ? '#261636' : '#fff',
        border: '#000'
      };
      this.legendLabelStyle = {
        padding: 3,
        font: 'bold 1rem',
        color: this.payscaleBrandingFeatureFlag ? '#312B36' : '#fff'
      };
      this.limitLabelText = {
        padding: 3,
        font: 'bold 1rem',
        color: this.payscaleBrandingFeatureFlag ? '#312B36' : '#fff',
        content: function(e) {
          if (e.text.length > 17) {
            return e.text.substring(0, 14) + '...';
          }
          return e.text;
        }
      };
    }
  }

  trackById(index: number, exchangeMetrics: any): number {
    return exchangeMetrics.ExchangeId;
  }

  // Carousel handlers
  handleControlRightClick(event) {
    event.preventDefault();
    this.carousel.next();
  }

  handleControlLeftClick(event: MouseEvent) {
    event.preventDefault();
    this.carousel.prev();
  }

  handleIndicatorClick(event, index: string) {
    event.preventDefault();
    this.carousel.select(index);
  }

  onCarouselSlideChange(slideEvent: NgbSlideEvent): void {
    this.model.SelectedExchangeId = +slideEvent.current;
  }
}

