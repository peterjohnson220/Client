import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import * as fromExchangeDataCutsActions from '../actions';
import * as fromExchangeDataCutsReducer from '../reducers';


import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-exchange-data-cuts',
  templateUrl: './exchange-data-cuts.component.html',
  styleUrls: ['./exchange-data-cuts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExchangeDataCutsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterGUID: string;
  loading$: Observable<boolean>;
  showError$: Observable<boolean>;
  exchangeDataCut: any;
  mapUrl: string;
  exchangeDataCutSubscription$: Subscription;
  constructor(private store: Store<fromExchangeDataCutsReducer.State>) {
    this.loading$ = this.store.select(fromExchangeDataCutsReducer.getLoading);
    this.showError$ = this.store.select(fromExchangeDataCutsReducer.getHasError);
    this.exchangeDataCutSubscription$ = this.store.select(fromExchangeDataCutsReducer.getExchangeDataCut).subscribe(v => {
      if (v) {
        this.exchangeDataCut = v;
        this.mapUrl = this.getMapUrl(v);
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterGUID'] && changes['filterGUID'].currentValue) {
      this.store.dispatch(new fromExchangeDataCutsActions.LoadPeerDataCut(changes['filterGUID'].currentValue));
    }
    if (!changes['filterGUID'].currentValue) {
      this.store.dispatch(new fromExchangeDataCutsActions.ClearState());
    }
  }
  ngOnDestroy() {
    this.exchangeDataCutSubscription$.unsubscribe();
  }

  getMapUrl(exchangeDataCut) {
    if (exchangeDataCut) {
      const htmlEncodedHashTag = '%23';
      const geoJson = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [exchangeDataCut['PolygonCoords']]
        },
        properties: {
          stroke: htmlEncodedHashTag + '3f8845',
          fill: htmlEncodedHashTag + '3f8845',
          'fill-opacity': 0.1
        }
      };
      return environment.mapBoxBaseUrl + 'geojson(' + JSON.stringify(geoJson) + ')/auto/600x600?access_token=' + environment.mapBoxAPIKey;
    }
    return null;
  }
}
