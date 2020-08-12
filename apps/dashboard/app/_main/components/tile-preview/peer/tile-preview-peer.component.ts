import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap/carousel/carousel';
import cloneDeep from 'lodash/cloneDeep';

import { TilePreviewPeer } from '../../../models';

@Component({
  selector: 'pf-tile-preview-peer',
  templateUrl: './tile-preview-peer.component.html',
  styleUrls: [ './tile-preview-peer.component.scss' ]
})
export class TilePreviewPeerComponent  implements OnInit {
  @ViewChild(NgbCarousel) carousel: NgbCarousel;
  @Input() model: TilePreviewPeer;

  exchangePreviewModels: any[];

  public seriesItemHighlightStyle: any = {
    opacity: 1,
    color: '#fff',
    border: '#000'
  };
  public legendLabelStyle: any = {
    padding: 3,
    font: 'bold 1rem',
    color: '#fff'
  };
  public limitLabelText: any = {
    padding: 3,
    font: 'bold 1rem',
    color: '#fff',
    content: function(e) {
      if (e.text.length > 17) {
        return e.text.substring(0, 14) + '...';
      }
      return e.text;
    }
  };

  ngOnInit() {
    this.exchangePreviewModels = cloneDeep(this.model.ExchangePreviewModels);
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

