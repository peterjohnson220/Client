import { Directive, Host, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import {Map} from 'mapbox-gl';
import { MapService, ɵn, ɵa } from 'ngx-mapbox-gl/';
import * as MapBoxGeocoder from 'mapbox-gl-geocoder';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[pfGeocoder]'
})
export class GeocoderDirective implements OnChanges, OnInit, OnDestroy {
  // TODO: Can't get this to work without forking.
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Change!', changes);
    this.controlComponent.control = new MapBoxGeocoder({accessToken: environment.mapboxAccessToken});
    const test: any = this.controlComponent;
    console.log('control: ', test.MapService);
  }
  mapLoadedSubscription: Subscription;
  mapCreatedSubscription: Subscription;
  @Input() mapLoaded$: Observable<boolean>;
  constructor(
    @Host() private controlComponent: ɵn
  ) {}

  ngOnInit(): void {

    this.mapLoaded$.subscribe(() => {
      console.log('Test!');
    });

    let test: any = this.controlComponent;

    test.MapService.mapCreated$.subscribe(() => {
      console.log('Map Created!');
      this.controlComponent.control = new MapBoxGeocoder({accessToken: environment.mapboxAccessToken});
    });
    // this.mapComponent.zoomEnd.subscribe(() => {
    //   console.log('mapComponent: ZoomEnd!');
    // });
    // this.mapCreatedSubscription = this.mapService.mapCreated$.subscribe(() => {
    //   this.controlComponent.control = new MapBoxGeocoder({accessToken: environment.mapboxAccessToken});
    // });
    // this.mapLoadedSubscription = this.mapService.mapLoaded$.subscribe(() => {
    //   const geo: any = this.controlComponent.control;
    //   console.log(geo);
    //   if (this.controlComponent.content.nativeElement) {
    //     geo.query(this.payMarket);
    //   }
    //
    //   this.mapService.mapEvents.mouseDown.subscribe(() => {
    //     console.log('MapServiceListening on MouseDown!');
    //   });
    // });
  }
  ngOnDestroy(): void {
    this.mapCreatedSubscription.unsubscribe();
    this.mapLoadedSubscription.unsubscribe();
  }
}

