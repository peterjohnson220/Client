import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'pf-peer-pricing-match',
  templateUrl: './peer-pricing-match.component.html',
  styleUrls: ['./peer-pricing-match.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PeerPricingMatchComponent implements OnInit, OnChanges {
  @Input() pricingMatch: any;
  badImageUrl: boolean;
  mapUrl: string;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pricingMatch'] && changes['pricingMatch'].currentValue) {
      this.mapUrl = this.getMapUrl(changes['pricingMatch'].currentValue);
    }

  }
  getMapUrl(pricingMatch) {
    this.badImageUrl = false;
    if (pricingMatch && pricingMatch['PolygonCoords'] ) {
      const htmlEncodedHashTag = '%23';
      const geoJson = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [pricingMatch['PolygonCoords']]
        },
        properties: {
          stroke: htmlEncodedHashTag + '3f8845',
          fill: htmlEncodedHashTag + '3f8845',
          'fill-opacity': 0.1
        }
      };
      return environment.mapBoxBaseUrl + 'geojson(' + JSON.stringify(geoJson) + ')/auto/600x600?access_token=' + environment.mapBoxAPIKey;
    }
    this.badImageUrl = true;
    return null;
  }
}
