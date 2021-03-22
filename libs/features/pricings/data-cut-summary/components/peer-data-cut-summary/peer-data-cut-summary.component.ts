import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'pf-peer-data-cut-summary',
  templateUrl: './peer-data-cut-summary.component.html',
  styleUrls: ['./peer-data-cut-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PeerDataCutSummaryComponent implements OnInit, OnChanges {
  @Input() dataCutSummary: any;
  badImageUrl: boolean;
  mapUrl: string;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataCutSummary'] && changes['dataCutSummary'].currentValue) {
      this.mapUrl = this.getMapUrl(changes['dataCutSummary'].currentValue);
    }

  }
  getMapUrl(dataCutSummary) {
    this.badImageUrl = false;
    if (dataCutSummary && dataCutSummary['PolygonCoords'] ) {
      const htmlEncodedHashTag = '%23';
      const geoJson = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [dataCutSummary['PolygonCoords']]
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
